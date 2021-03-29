---
title: 'Dragon'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['DP']
date: '2021-01-17'
---

# 문제

- [DRAGON](https://www.algospot.com/judge/problem/read/DRAGON)

## 코드

<details><summary> 코드 보기 </summary>

```javascript
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>

using namespace std;
const int MAX = 1000000000 + 1;
int length[51];
const string EXPAND_X = "X+YF";
const string EXPAND_Y = "FX-Y";
void precalc()
{
	length[0] = 1;
	for (int i = 1; i <= 50; ++i)
		length[i] = min(MAX, length[i - 1] * 2 + 2);
}
char expand(const string& drangonCurve, int generations, int skip)
{
	if (generations == 0)
	{
		return drangonCurve[skip];
	}
	for (int i = 0; i < drangonCurve.size(); ++i)
	{
		// 문자열이 확장되는 경우
		if (drangonCurve[i] == 'X' || drangonCurve[i] == 'Y')
		{
			if (skip >= length[generations])
				skip -= length[generations];
			else if (drangonCurve[i] == 'X')
				return expand(EXPAND_X, generations - 1, skip);
			else
				return expand(EXPAND_Y, generations - 1, skip);
		}
		// 확장 되지 않고 다음 글자로 넘어가는 경우
		else if (skip > 0)
			skip -= 1;
		// 더 이상 스킵하지 않는 경우
		else
			return drangonCurve[i];
	}
	return '#'; // 더미 코드
}
int main()
{
	int tc;
	cin >> tc;
	precalc();
	while (tc-- > 0)
	{
		int n, p, l;
		cin >> n >> p >> l;
		for(int i=0; i<l; ++i)
			cout << expand("FX", n, p + i - 1);
		cout << '\n';
	}
}
```

</details>

## ⭐️느낀점⭐️

> 불필요한 부분을 뛰어넘는 과정을 떠올리기가 쉽지 않았다. 비슷한 풀이를 여러번 해보면서 감을 잡아야겠다고 생각했다. 디비 수업 팀프도 하면서 해야해서 너무 바빴다 ㅜㅜ

<hr/>

## 풀이 📣

1️⃣ X와 Y일 경우 펼쳐진다(확장한다)

2️⃣ 그 때 확장된 문자열의 개수는 (이전 세대 \* 2 + 2) 가 된다. 0세대의 FX에서 F는 고정적이므로 바로 출력해준다.

3️⃣ main 함수에서 n 세대의 시작 인덱스 p -1부터 p - 1 + l 번째까지 순차적으로 탐색한다.

4️⃣ n ~ 0 세대까지 Top down 방식으로 재귀호출하여 탐색하는데, 0세대까지 도달했다면 더 이상 확장이 되지 않은 원시의 문자열이므로 skip 번째 character를 출력한다.

5️⃣ 0 세대에 도달하기 전, 만약 skip 이 현 세대의 최대 문자열 길이수보다 크다면, skip 에서 현 세대 문자열의 최대 길이를 빼준다.

6️⃣ 현 세대의 문자열의 최대 길이가 skip보다 클 경우, 더 이상 세대를 건너뛸 수 없다.

7️⃣ 현 세대에서 가리키고 있는 인덱스의 문자가 X 또는 Y 일 경우 정해진 문자열로 확장하며 세대를 감소시켜 재귀호출을 한다.

8️⃣ 4번 ~ 7번과정을 반복하며 k - 1 개의 문자를 뛰어넘은 다음의 문자를 찾아 출력한다.

<hr/>

## 실수 😅

- x 개수는 세대가 증가할수록 (전 세대 x개수 + 전 세대 y개수 + 2)이며 y도 마찬가지라는 것은 이해했었는데, 한 세대의 총 문자열의 개수가 왜 (전 세대 * 2 + 2) 가 되는지를 이해하지 못했다. 1세대 5개 2세대 11개.. 왜 *2 + 2 이라는 거지?? \*2 +1 아니야?? 라는 생각에 빠져 한참을 고민했다.
- 현 세대에서 x 개수와 y 개수는 같으므로. x와 y 모두 x 개수로 생각하고 양변을 더하면 2xLength(n) = 2(2 _ xlength(n-1) + 2) 가 되므로 xlength(n) = 2 _ xlength(n - 1) + 2 가 된다. 어차피 확장하는건 X 와 Y 뿐이므로, 각 세대에서 X와 Y를 가리킬 경우 확장 가능한 경우는 해당 세대에서 확장 가능한 최대의 경우가 된다. (len[gen])
- 요약 : X와 Y만 확장이 가능하므로, S 세대에서 가장 긴 문자열의 길이는 X 또는 Y를 S-1 세대 만큼 확장한 길이의 \* 2 + 2 인 셈이다.
