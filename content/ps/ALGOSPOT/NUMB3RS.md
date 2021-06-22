---
title: 'NUMB3RS'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['DP', '확률']
date: '2021-01-17'
---

# 문제

- [NUMB3RS](https://www.algospot.com/judge/problem/read/NUMB3RS)

## 코드

<details><summary> 코드 보기 </summary>

```
#include <iostream>
#include <vector>
#include <cstring>
#include <string>
#include <algorithm>
using namespace std;

int n, d, p; // 마을 수, 지금까지 지난 일 수, 교도소 마을의 번호
vector<vector<int>> arr(51);
int m[51][51];
double possi[51];
double cache[51][101]; // (현재 마을, 지난 일 수) => 이미 방문한 곳인지 체크.
double getPossi(int cur, int dest, int days)
{
	if (days == d)
	{
		if (cur == dest) return 1;
		else return 0;
	}
	double& ret = cache[cur][days];
	if (ret != -1) return ret;
	ret = 0;

	double value = 1 / (double)arr[cur].size();
	for (int i = 0; i < n; ++i)
		if(m[cur][i])
			ret = ret + value * getPossi(i, dest, days + 1);
	return ret;
}
int main()
{
	int tc, villege;
	cin >> tc;
	while (tc-- > 0)
	{
		/* Set default */
		fill_n(possi, 51, 0);
		arr.clear();
		arr.resize(51);

		/* Input data */
		cin >> n >> d >> p;
		int temp;
		for (int i = 0; i < n; ++i)
			for (int j = 0; j < n; ++j)
			{
				cin >> temp;
				m[i][j] = temp;
				if (temp) arr[i].push_back(j);
			}

		/* Retrive answer */
		cin >> villege;
		for (int i = 0; i < villege; ++i)
		{
			for (int j = 0; j < n; ++j)
				for (int k = 0; k < d; ++k)
					cache[j][k] = -1;
			int dest;  cin >> dest;
			printf("%.8lf ", getPossi(p, dest, 0));
		}
		printf("\n");
	}
}
```

</details>

## ⭐️느낀점⭐️

> 확률을 사용해서 이전까지 해왔던 DP 문제풀이와는 느낌이 달랐다. 하지만 크게 어렵지 않게 구현할 수 있었다.

<hr/>

## 풀이 📣

1️⃣ 2차원 vector를 생성하여 각 마을에서 길이 존재하는 마을들의 인덱스를 저장한다.

2️⃣ 현재 도달한 마을에서 이동 가능한 마을의 수에 따라 확률을 곱하여준다.

3️⃣ cache[현재 도달한 마을][경과한 날짜] 로 캐슁하며 이동을 반복한다.

4️⃣ 최종 날짜에 최종 목적지에 도달하면 해당 확률을 리턴한다.

<hr/>

## 실수 😅

- dp를 수행할 때 캐싱을 어떻게 해야할 지 고민이 되어서 [최초로 출발한 마을][현재 마을][경과한 날짜]로 캐싱했다가 잘못되었음을 깨닫고, cache 배열을 바꾸었다.
