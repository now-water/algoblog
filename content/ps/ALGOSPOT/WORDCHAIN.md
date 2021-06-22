---
title: 'WORDCHAIN'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그래프 이론', '위상 정렬']
date: '2021-01-17'
---

# 문제

- [WORDCHAIN](https://algospot.com/judge/problem/read/WORDCHAIN)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
#include <queue>
#include <string>
#define pii pair<int, int>
using namespace std;
vector<string> words;
// adj[i][j] = i와 j사이의 간선의 수
vector<vector<int>> adj;
// i에서 시작해서 j 로 끝나는 단어의 목록
vector<string> graph[26][26];
vector<int> indegree, outdegree;
void makeGraph()
{
	// 전역변수 초기화
	for (int i = 0; i < 26; ++i)
		for (int j = 0; j < 26; ++j)
			graph[i][j].clear();
	adj = vector<vector<int>>(26, vector<int>(26, 0));
	indegree = outdegree = vector<int>(26, 0);

	for (int i = 0; i < words.size(); ++i)
	{
		int a = words[i][0] - 'a', b = words[i][words[i].size() - 1] - 'a';
		graph[a][b].push_back(words[i]);
		adj[a][b]++;
		outdegree[a]++;
		indegree[b]++;
	}
}
void getEulerCircuit(int here, vector<int>& circuit)
{
	for (int there = 0; there < 26; ++there)
	{
		while (adj[here][there] > 0)
		{
			adj[here][there]--;
			getEulerCircuit(there, circuit);
		}
	}
	circuit.push_back(here);
}
vector<int> getEulerTrailOrCircuit()
{
	vector<int> circuit;
	for (int i = 0; i < 26; ++i)
	{
		// 트레일을 찾는다. 시작점이 존재하는지 찾는다. (트레일은 나가는 간선이 1개 더 많아야함)
		if (indegree[i] + 1 == outdegree[i])
		{
			getEulerCircuit(i, circuit);
			return circuit;
		}
	}
	for(int i=0; i<26; ++i)
	{
		// 트레일이 아니면 서킷이다. 간선에 인접한 아무 정점에서 시작한다.
		if (outdegree[i])
		{
			getEulerCircuit(i, circuit);
			return circuit;
		}
	}
	// 모두 실패한 경우 빈 배열 반환.
	return circuit;
}
bool checkEuler()
{
	int plus1 = 0, minus1 = 0;
	for (int i = 0; i < 26; ++i)
	{
		int delta = indegree[i] - outdegree[i];
		if (delta < -1 || delta > 1) return false;
		if (delta == -1) minus1++;
		if (delta == 1) plus1++;
	}
	return (plus1 == 1 && minus1 == 1) || (plus1 == 0 && minus1 == 0);
}
string solve()
{
	makeGraph();
	if (!checkEuler()) return "IMPOSSIBLE";
	vector<int>circuit = getEulerTrailOrCircuit();
	if (circuit.size() != words.size() + 1) return "IMPOSSIBLE";

	reverse(circuit.begin(), circuit.end());
	string ret;
	for (int i = 1; i < circuit.size(); ++i)
	{
		int a = circuit[i - 1], b = circuit[i];
		if (ret.size()) ret += " ";
		ret += graph[a][b].back();
		graph[a][b].pop_back();
	}
	return ret;
}
int main()
{
	int tc;
	cin >> tc;
	while (tc-- > 0)
	{
		int n;
		cin >> n;
		words.clear();
		for (int i = 0; i < n; ++i)
		{
			string line; cin >> line;
			words.push_back(line);
		}
		string ans = solve();
		cout << ans << '\n';
	}
}
```

</details>

## ⭐️느낀점⭐️

> 위상정렬을 완전히 이해할 수 있었다.. 처음에 이해가 안되서 한 6시간동안 보면서 멘탈이 산산조각 났지만! 결과는 GOOD
> 오일러 회로와 오일러 경로 개념을 완벽히 이해했다.
> 주어진 문제를 그래프로 바꾸기까지 떠올리는게 쉽지 않다.. 어떻게 이런걸 바로 생각해낼 수 있지..?

<hr/>

## 풀이 📣

1️⃣ 정점을 알파벳 한글자로 보고, 간선을 단어로 생각한다. 즉, 단어 하나씩 뜯어보면서 첫글자에서 마지막 글자로 가는 간선이 해당 단어

2️⃣ graph[첫글자][마지막글자] = 첫글자 시작, 마지막 글자로 끝나는 단어 저장하는 벡터이다.

3️⃣ adj[첫글자][마지막글자] = 첫글자 시작, 마지막 글자로 끝나는 단어 개수를 저장한다.

4️⃣ indegree : 들어오는 간선의 수, outdegree : 나가는 간선의 수

5️⃣ EulerCheck : 오일러 트레일 or 회로인지 체크

6️⃣ 나가는거가 들어오는거보다 1개 적은 경우, 해당 정점에서 트레일 시작. 나가는거랑 들어오는거 같은 경우, 나가는 간선이 있는 아무 정점에서 회로 시작

7️⃣ 최종적으로 획득한 DAG 의 size가 단어의 size + 1인지 확인 => 처음 단어를 시작할 때 시작-끝 글자도 추가하기 때문에 1개 더 많다

8️⃣ 위상정렬을 위해 DAG를 뒤집으면 오일러 회로/경로 순서가 나온다.

9️⃣ 그걸로 graph[첫글자][마지막글자] 하나씩 아무거나 꺼내서 출력한다.

<hr/>

## 실수 😅

- DAG 의 size가 왜 단어의 size + 1인지 이해하지 못했다. 그림을 그려가면서 과정을 생각해보니 이해할 수 있었다.
- 오일러 경로와 회로의 개념을 정확히 이해하지 못하고 문제 풀이부터 봐서 풀이를 이해하는데 오래 걸렸다.
