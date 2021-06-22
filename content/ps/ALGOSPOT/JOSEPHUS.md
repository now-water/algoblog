---
title: 'JOSEPHUS'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['자료 구조']
date: '2021-01-17'
---

# 문제

- [JOSEPHUS](https://www.algospot.com/judge/problem/read/JOSEPHUS)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <vector>
#include <cmath>
#include <queue>
#include <list>
#define pdd pair<double, double>
using namespace std;

int main()
{
	int tc;
	cin >> tc;
	while (tc-- > 0) {
		int n, k;
		cin >> n >> k;
		list<int> survived;
		for (int i = 0; i < n; ++i) survived.push_back(i + 1);
		list<int>::iterator kill = survived.begin();
		while (n > 2)
		{
			kill = survived.erase(kill);
			n -= 1;
			if (kill == survived.end()) kill = survived.begin();
			for (int i = 0; i < k - 1; ++i)
			{
				kill++;
				if (kill == survived.end()) kill = survived.begin();
			}
		}
		cout << survived.front() << " " << survived.back() << '\n';
	}
}
```

</details>

## ⭐️느낀점⭐️

> List STL을 유용하게 사용할 수 있었다. 처음에 자꾸 STL을 안쓰고 1차원 배열을 환형큐로 생각하고 구현하였는데 자꾸 에러가 났다. STL에 친숙해지자

<hr/>

## 풀이 📣

1️⃣ 리스트 STL을 써서 각 노드에 1부터 N까지 저장해준다.

2️⃣ 첫 번째를 없애고 k-1만큼씩 iterator를 옮겨가며 제거해준다.

3️⃣ 만약 list의 마지막에 도달하면 처음으로 iterator를 옮겨주고 다시 반복한다.

<hr/>

## 실수 😅

- 1차원 배열을 환형큐로 여겨 인덱스 벗어나면 원점으로 돌려주는 방법으로 짰다가 실패했다. 이미 죽은 사람은 -1로 표시를 하여 이 부분에서는 인덱스를 계속 +1씩 증가시키며 넘어가고, 카운트를 세지 않았는데 왜 안되었을까..
