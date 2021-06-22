---
title: 'GRADUATION'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['DP', '비트 마스킹']
date: '2021-01-17'
---

# 문제

- [GRADUATE](https://www.algospot.com/judge/problem/read/GRADUATE)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <queue>
#include <vector>
#include <cstring>
#define INF 987654321
using namespace std;

int n, k, m, l;
int pre[15], classes[15], cache[15][1<<13 + 1];
int getCount(int num)
{
	if (num == 0) return 0;
	return (num % 2) + getCount(num / 2);
}
void init()
{
	memset(cache, -1, sizeof(cache));
	for (int i = 0; i < n; ++i)
	{
		int temp, p = 0;
		cin >> temp;
		for (int j = 0; j < temp; ++j)
		{
			int sub;
			cin >> sub;
			p |= (1 << sub);
		}
		pre[i] = p;
	}
	for (int i = 0; i < m; ++i)
	{
		int temp, s = 0; cin >> temp;
		for (int j = 0; j < temp; ++j)
		{
			int val;
			cin >> val;
			s |= (1 << val);
		}
		classes[i] = s;
	}
}
int graduate(int sem, int taken)
{
	if (getCount(taken) >= k) return 0;
	if (sem >= m) return INF;
	int& ret = cache[sem][taken];
	if (ret != -1) return ret;
	ret = INF;

	int canTake = classes[sem] & (~taken);
	for (int i = 0; i < n; ++i)
	{
		if ((1 << i) & canTake && (pre[i] & taken) != pre[i])
			canTake &= ~(1 << i);
	}
	for (int take = canTake; take > 0; take = ((take - 1) & canTake))
	{
		if (getCount(take) > l) continue;
		ret = min(ret, 1 + graduate(sem + 1, taken | take));
	}
	ret = min(ret, graduate(sem + 1, taken));
	return ret;
}
int main() {
	int tc; cin >> tc;
	while (tc-- > 0) {
		// n : 전공과목수
		// k : 들어야 할 과목수
		// m : 학기의 수
		// L : 한 학기에 최대 들을 수 있는 과목수

		cin >> n >> k >> m >> l;
		init();
		int res = graduate(0, 0);
		if (res == INF) cout << "IMPOSSIBLE" << '\n';
		else cout << res << '\n';
	}
}
```

</details>

## ⭐️느낀점⭐️

> 비트 연산은 정말 익숙해질때까지 해봐야겠다. 부분집합을 구하는 부분을 전혀 생각 못해서 TSP 풀 때 했던 것 처럼 따라하다가 재귀적으로 생각하면서 점점 꼬여서 힘들었다..ㅜㅜ

<hr/>

## 풀이 📣

1️⃣ 선수과목과 학기 별 개설되는 과목들을 인트 배열의 비트들로 저장해둔다.

2️⃣ 기저 사례로는 이미 L 과목 이상을 들었는지, M학기를 초과했는지를 확인한다

3️⃣ cache[학기][이수한 과목]으로 캐싱하여 탐색 시간을 줄인다.

4️⃣ 현재 학기에 개설되는 과목 중 아직 이수하지 않은 과목들을 비트연산으로 구한다.

5️⃣ 이수하지 않은 과목 중 선수과목을 다 들었는지 체크하기 위해 비트연산을 수행한다.

6️⃣ 최종적으로 이수할 수 있는 과목만을 선별하여 모든 부분집합을 탐색하여 L 개 이하로 수강하고 학기를 마친다.

7️⃣ 위의 과정을 반복하며 최종적으로 M학기 이내에 K 개의 강의를 수강할 수 있는지 판단한다.

<hr/>

## 실수 😅

- 해당 학기에서 수강가능한 과목을 선별하는 것 까지는 생각해 냈지만, 그 중 L개 이하로 선택하는 것을 떠올리지 못했다. 완전탐색으로 부분집합을 만드는 함수를 구현해보려고 했지만 자꾸 어디선가 에러가 발생했다..
- 비트연산이 아직 서툴다. 부분집합과 비트크기를 계산하는 테크닉은 알아둬야겠다.
