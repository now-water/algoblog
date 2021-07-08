---
title: '2879. 코딩은 예쁘게'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그리디', '구현']
date: '2021-07-07'
---

# 문제
- [2879. 코딩은 예쁘게](https://www.acmicpc.net/problem/2879)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Stack;
import java.util.StringTokenizer;

public class Q2812 {
    static int n, k;
    static char num[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        Stack<Integer> st = new Stack<>();
        int len = num.length;
        for (int i = 0; i < len; i++) {
            int number = num[i] - '0';

            // 남은 개수를 다 넣어주는 상황
            if(len - i + st.size() <= n - k){
                st.push(number);
                continue;
            }

            // 최대의 수를 만들도록 넣어주는 상황
            while(!st.isEmpty() && st.peek() < number && fillCount(len, i, st.size())) {
                st.pop();
            }
            if(st.size() < n - k)
                st.push(number);
        }

        StringBuilder sb = new StringBuilder("");
        while (!st.isEmpty()) {
            sb.insert(0, st.pop());
        }
        System.out.println(sb.toString());
    }

    private static boolean fillCount(int total, int cur, int stackSize) {
        int remained = total - cur;
        return stackSize + remained > n - k;
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = stoi(st.nextToken());
        k = stoi(st.nextToken());
        num = br.readLine().toCharArray();
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}

```
</details>

## ⭐️느낀점⭐️
> 처음에 그룹을 만드는 방법을 떠올리지 못해서 틀렸다. 생각해보면 간단한 방법이었는데, DP 라는 힌트를 얻고 오히려 생각이 굳은 것 같다.

## 풀이 📣
<hr/>

1️⃣ 목표 인덴트를 만들기 위해서 현재 인덴트값과의 차이를 보관하는 배열을 만든다. 

    - diff[i] : i번째 줄의 인덴트의 차이


2️⃣ 앞에서부터 차례대로 그룹을 만들어나간다.

    - 만약 차이값이 동일한 부호를 갖는다면 같은 그룹으로 묶을 수 있다.

    - 차이값이 다른 부호를 갖는다면, 다른 그룹에 속한다.


3️⃣ 다음 줄이 현재까지와 다른 그룹에 속하면, 현재까지 그룹에서 구한 인덴트의 합을 더해준다.

    - 예를 들어, 현재까지 인덴트를 빼야하는 개수를 세왔었는데, 다음 줄에서는 인덴트를 추가해야할 경우가 있을 수 있다.

    - 그때는 현재까지 구해온 빼야할 인덴트 개수를 정답에 더해주고, 인덴트를 추가해야 하는 새로운 그룹을 탐색해야 한다.


4️⃣ 다음 줄이 현재까지와 같은 그룹에 속하면 두 가지 경우로 나눠진다.

    - 첫 번째는, 현재까지 구한 인덴트 변경 개수보다 더 많은 변경 개수가 필요한 경우다.

    - 이때는 현재까지 구한 개수보다 더 많은 개수가 필요하므로, 어차피 동일한 그룹이기에 더 많이 필요한 개수만큼 증가시키면 앞서서 필요한 인덴트 개수들도 그 과정에서 다 추가해줄 수 있다.

    - 두 번째는, 현재까지 구한 인덴트 변경 개수보다 더 적은 변경 개수를 필요로 하는 경우다.

    - 이때는, 현재 그룹에서 (현재까지 필요한 인덴트 개수 - 다음에 필요한 인덴트 개수) 만큼을 미리 증가시켜준다.

    - 그리고 나머지 차액 만큼은 동일 그룹 내에서 한 번에 같이 변경시켜줄 수 있게 된다. 따라서 해당 차액만큼을 새로운 현재까지의 필요한 인덴트 개수로 저장하고 계속 그룹을 찾아나간다.


5️⃣ 마지막 번째 줄까지 필요한 인덴트 개수를 찾아나간다.

    - 그리고 마지막 번째 줄까지 모두 맞춰주기 위해 필요한 인덴트 개수를 더해주고 출력한다.

## 실수 😅
<hr/>

- 예제 입력 3번을 보면서 문제 의도와 다르게 해석했다.

- 그룹을 생성하는 것이 연속이 아니라, 불연속적일 수 도 있다고 해석해서 접근법을 놓쳐버렸다.

- 이후 힌트를 봤고, DP를 사용한다는 사실에 더 미궁 속으로 빠졌다.. 사실은 DP를 안써도 되는 것인데.ㅜㅜ