---
title: 'FORTRESS'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['기하', '트리']
date: '2021-01-17'
---

# 문제

- [FORTRESS](https://www.algospot.com/judge/problem/read/FORTRESS)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <vector>
#include <cstring>
#include <string>
#include <algorithm>
using namespace std;
struct Circle
{
	int r;
	int x;
	int y;
	vector<int> children;
	bool operator< (Circle temp) {
		return r > temp.r;
	}
};
vector<Circle> circles;
int n, h[101], longest = 0;
int sqr(int a)
{
	return (a * a);
}
int getDist(int ia, int ib)
{
	Circle a = circles[ia], b = circles[ib];
	return sqr(a.x - b.x) + sqr(a.y - b.y);
}
bool enclose(int a, int b)
{
	int ra = circles[a].r, rb = circles[b].r;
	return ra > rb && getDist(a, b) <sqr(ra - rb);
}
bool isChild(int parent, int child)
{
	if (!enclose(parent, child)) return false;
	for (int i = 0; i < n; ++i)
	{
		if (i != parent && i != child && enclose(parent, i) && enclose(i, child))
			return false;
	}
	return true;
}
int getHeight(int root)
{
	vector<int> height;
	for (auto& elem : circles[root].children)
		height.push_back(getHeight(elem));
	if (height.empty()) return 0;
	sort(height.begin(), height.end());
	if (height.size() >= 2)
		longest = max(longest, 2 + height[height.size() - 2] + height[height.size() - 1]);
	return height.back() + 1;
}
int main()
{
	int tc, x, y, r;
	cin >> tc;
	while (tc-- > 0)
	{
		cin >> n;
		circles.resize(n);
		for (int i = 0; i < n; ++i)
			cin >> circles[i].x >> circles[i].y >> circles[i].r;
		sort(circles.begin(), circles.end());
		memset(h, 0, sizeof(h));
		for (int i = 0; i < n; ++i)
		{
			for(int j= i +1; j<n; ++j)
			{
				if (isChild(i, j))
					circles[i].children.push_back(j);
			}
		}
		longest = 0;
		int ans = getHeight(0);
		ans = max(ans, longest);
		cout << ans << '\n';
		circles.clear();
	}
}
```

오답 코드

```
#include <iostream>
#include <vector>
#include <cstring>
#include <string>
#include <algorithm>
using namespace std;
struct Circle
{
	int r;
	int x;
	int y;
	vector<int> children;
	bool operator< (Circle temp) {
		return r > temp.r;
	}
};
vector<Circle> circles;
int n, h[101];
int sqr(int a)
{
	return (a * a);
}
int getDist(int ia, int ib)
{
	Circle a = circles[ia], b = circles[ib];
	return sqr(a.x - b.x) + sqr(a.y - b.y);
}
bool enclose(int a, int b)
{
	int ra = circles[a].r, rb = circles[b].r;
	return ra > rb && getDist(a, b) <sqr(ra - rb);
}
bool isChild(int parent, int child)
{
	if (!enclose(parent, child)) return false;
	for (int i = 0; i < n; ++i)
	{
		if (i != parent && i != child && enclose(parent, i) && enclose(i, child))
			return false;
	}
	return true;
}
int getHeight(int root)
{
	int& height = h[root];
	for (auto& elem : circles[root].children)
		height = max(height, 1 + getHeight(elem));
	return height;
}
int getLongHeight(int root)
{
	vector<int> value;
	for (auto& elem : circles[root].children)
		value.push_back(1 + h[elem]);
	sort(value.begin(), value.end());
	if (value.size() >= 2)
		return value[value.size() - 1] + value[value.size() - 2];
	return value.back();
}
int main()
{
	int tc, x, y, r;
	cin >> tc;
	while (tc-- > 0)
	{
		cin >> n;
		circles.resize(n);
		for (int i = 0; i < n; ++i)
			cin >> circles[i].x >> circles[i].y >> circles[i].r;
		sort(circles.begin(), circles.end());
		memset(h, 0, sizeof(h));
		for (int i = 0; i < n; ++i)
		{
			for(int j= i +1; j<n; ++j)
			{
				if (isChild(i, j))
					circles[i].children.push_back(j);
			}
		}
		int ans = getHeight(0);
		ans = max(ans, getLongHeight(0));
		cout << ans << '\n';
		circles.clear();
	}
}
```

</details>

## ⭐️느낀점⭐️

> 트리의 구조와 특성에 대해서 다시 한 번 생각해볼 수 있어 좋았다

<hr/>

## 풀이 📣

1️⃣ 원들의 포함관계를 먼저 파악한다. 포함 여부를 통해서 부모-자식 관계가 성립하므로 트리구조를 떠올린다.

2️⃣ 부모-자식 관계를 구성하기 위해 두 원이 직접적으로 포함되는지 파악한다.

3️⃣ 둘 사이에 다른 원이 있다면 직접 포함하는 관계가 아니다.

4️⃣ 트리를 구성한 후, 트리에서 서로 가장 먼 거리에 있는 두 노드를 찾는다.

5️⃣ 그렇다면 루트-잎 or 잎-잎 노드밖에 존재하지 않는다.

6️⃣ 트리의 높이를 찾는 함수에서 현재 루트노드의 모든 자식 노드들의 높이를 저장한다.

7️⃣ 만약 자식이 두명 이상이라면 정렬된 상태에서 (가장 마지막 두 노드의 높이 합) + 2 를 해준 값이 잎-잎 노드의 거리이다.

8️⃣ 잎-잎 노드의 거리의 최대합은 각 서브트리마다 달라지므로 전역변수 longest를 통해 모든 서브트리에서 최대값을 갱신한다.

9️⃣ 최종적으로 루트 노드의 높이와 각 서브트리들의 최대 거리 longest를 비교한 후 더 큰 값을 출력한다.

<hr/>

## 실수 😅

- 잎-잎 노드 거리의 최대값이 서브트리마다 달라질 수 있음을 간과하고, 전체 트리의 자식노드들의 높이 최대합을 구했다.
