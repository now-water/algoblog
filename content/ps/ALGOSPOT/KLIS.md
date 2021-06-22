---
title: 'KLIS'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['DP']
date: '2021-01-17'
---

# 문제

- [KLIS](https://www.algospot.com/judge/problem/read/KLIS)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#define MAX_VAL 2000000000 + 1
using namespace std;
vector<int> arr;
int cache_lis[501], cache_cnt[501];

// arr[idx] 에서 시작하는 증가 부분 수열 중 최대 길이 반환.
int lis(int idx)
{
	int& ret = cache_lis[idx + 1];
	if (ret != -1) return ret;
	ret = 1; // arr[idx] 는 항상 있으므로 1이다.
	for (int next = idx + 1; next < arr.size(); ++next)
		if (idx == -1 || arr[idx] < arr[next])
			ret = max(ret, 1 + lis(next));
	return ret;
}
// arr[idx] 에서 시작하는 최대 증가 부분 수열의 개수 반환.
int count(int idx)
{
	if (lis(idx) == 1) return 1;
	int& ret = cache_cnt[idx];
	if (ret != -1) return ret;
	ret = 0;
	for (int next = idx + 1; next < arr.size(); ++next)
		if((idx == -1 || arr[idx] < arr[next]) &&
			lis(idx) == lis(next) + 1)
			ret = min<long long>(MAX_VAL, (long long)ret + count(next));
	return ret;
}
// arr[start]에서 시작하는 LIS 중 사전 순으로 skip개 건너뛴 수열을 str에 저장한다.
void reconstruct(int start, int skip, vector<int>& str)
{
	// 1. arr[start]는 항상 str에 포함한다.
	// -> 재귀를 들어온다는 것은 더 이상 skip을 못하고 해당 숫자를 포함한 수열이라는 의미기 때문.
	if(start != -1) str.push_back(arr[start]);

	// 2. 뒤에 올 수 있는 숫자들과 위치의 목록을 만든다.
	// (숫자, 숫자의 위치)의 목록
	vector<pair<int, int>> followers;
	for (int next = start + 1; next < arr.size(); ++next)
		if ((start == -1 || arr[start] < arr[next]) && lis(start) == lis(next) + 1)
			followers.push_back(make_pair(arr[next], next));
	sort(followers.begin(), followers.end());

	// 3. K 번째 LIS의 다음 숫자를 찾는다.
	for (int i = 0; i < followers.size(); ++i)
	{
		// 이 숫자를 뒤에 이어서 만들 수 있는 LIS의 개수를 본다.
		int idx = followers[i].second;
		int cnt = count(idx);
		if (cnt <= skip) skip -= cnt;
		else {
			// 다음 숫자는 arr[idx] 임을 알 수 있다.
			// 4. 재귀호출을 시행한다.
			reconstruct(idx, skip, str);
			break;
		}
	}
}
int main()
{
	int tc;
	cin >> tc;
	while (tc-- > 0) {
		int n, k, res = 0;
		cin >> n >> k;
		arr.resize(n);
		memset(cache_lis, -1, sizeof(cache_lis));
		memset(cache_cnt, -1, sizeof(cache_cnt));
		for (int i = 0; i < n; ++i) cin >> arr[i];
		cout << lis(-1) - 1 << '\n';

		vector<int> str;
		reconstruct(-1, k - 1, str);
		for (auto& elem : str)
			cout << elem << ' ';
		cout << '\n';
		arr.clear();
	}
}
```

</details>

## ⭐️느낀점⭐️

> 처음에 skip 해주는 과정이 이해가 안되서 책의 설명을 한참 봤다. 그래도 이해가 안되서 코드를 보면서 문제의 본질을 이해하려고 하였다. lis(idx1) == lis(idx2) + 1 인 조건을 볼 때, 왜 그렇게 되는가?? 라고 고민을 계속 했다. 마침내 + 1 의 의미가 현재 idx2 의 최대 증가 부분수열이 바로 arr[idx1] 과 직접적으로 연결됨을 나타낸다는 것을 깨달았다!!! 최대 증가 부분수열의 개수를 통해 현재 arr[idx1]에서 직접적으로 연결될 수 있는 숫자들을 보관해서 arr에 저장된 값을 기준으로 오름차순 정렬을 하여 다음 수열이 skip이 가능한지 판단하는 것이다. 오름차순은 사전순으로 오는 증가 수열을 만들기 위해서! 휴,, 3시간동안 이 한 문제를 고민해서 마침내 이해할 수 있었다.

> count 하는 과정도 한참 보고 그림을 그려가며 생각해서 겨우 이해했다.. 전반적인 과정은 lis를 구하는 코드와 유사하다. 하지만 기저 사례가 lis(idx) == 1 일 경우 1을 리턴하는 것이 lis와 달랐다. lis에서는 단순히 참조할 수 있는 인덱스를 반복문으로 arr의 size보다 작을 때 까지만으로 제한해둬서 별다른 기저사례가 존재하지 않았다. 하지만 count의 경우, 더 이상 증가가 불가능한 값을 만나면 1을 리턴해준다. 그래서 이러한 과정이 어떻게, 최대 증가 부분 수열의 개수를 구할 수 있는가 의문이 들었다.

> 하지만 자세히 보니 "최대 증가 수열의 개수" 를 구하는 함수가 아닌 "최대 증가 부분 수열의 개수" 를 구하는 것이었다. 즉 idx1번째 값에서 (최대 증가 수열의 길이 - 1) 을 자신의 최대 증가 수열의 길이로 가지는 시작 idx2를 구한다. 그런 다음 idx2 번째 값의 "최대 증가 부분 수열의 개수" 들을 모두 더한 것이 idx1 번째 값에서 가질 수 있는 최대 증가 부분 수열의 개수가 된다!! 이러한 재귀적인 사고방식이 가능한 이유는 lis(idx1) = lis(idx2) + 1 이라는 조건을 통해서 가능했는데, 이는 idx1 에서 시작하는 증가수열에 idx2 에서 시작하는 증가수열이 포함된다는 뜻이기 때문이다.

> 요약하자면 lis(idx1) = lis(idx2) + 1 이라는 뜻은, idx1 번째 값과 idx2 번째 값이 하나의 최대 증가 수열에 포함되어 바로 다음 값으로 서로 연결되어 있다는 것이다. 따라서 재귀적으로 다음엔 idx2 에 대해서 들어가고, 다음은 idx3 ... 이런 식으로 수행해서 해당 증가 수열의 마지막 값을 만나면(lis(idx) == 1) 1을 반환하고 종료한다.

<hr/>

## 풀이 📣

1️⃣ 주어진 수열에 대해 최대 증가 수열의 길이를 구한다. DP를 이용해서 차례차례 idx를 한개씩 늘려가며 체크!

2️⃣ for 문을 돌며 현재 idx 의 다음에 직접적으로 연결될 수 있는 인덱스를 pair(arr[idx], idx) 형태로 저장하여 보관한다.

3️⃣ 이러한 pair 값들을 오름차순(사전순)으로 정렬한다.

4️⃣ pair의 각 idx 에서 시작하는 최대 증가 부분 수열의 개수를 구한다.

5️⃣ 만약 skip ( skip == k -1 ) 값이 idx 에서의 증가 수열의 개수보다 크다면 skip 에서 그 값을 빼준다 -> 뛰어넘는다.

6️⃣ skip이 idx 에서의 증가 수열의 개수보다 작아지면, arr[idx]를 answer 스트링에 추가하고 idx에서 부터 다시 재귀호출을 수행한다.

7️⃣ 이 때, 만약 arr의 인덱스 범위를 초과한다면 for문의 조건에 부합하는 경우가 없어서 아무런 동작을 하지 않고 반환되기 때문에 기저 사례가 없어도 된다.

<hr/>

## 실수 😅

- 코드 한줄 한줄이 한 번에 이해하기엔 어려웠다.. reconstruct 과정에서 start를 스트링에 저장하는 것이 아니라 arr[start]를 저장해야 하는데 이를 실수했다.
