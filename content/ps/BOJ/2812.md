---
title: '2812. 크게 만들기'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['자료 구조', '스택']
date: '2021-07-06'
---

# 문제
- [2812. 크게 만들기](https://www.acmicpc.net/problem/2812)

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
> 스택 문제를 연습하기 위해 풀어봤다. 이전에 풀어봤던 오큰수 와 비슷한 문제였다.
>
> 그리디스러운 접근법을 이용했다.

## 풀이 📣
<hr/>

1️⃣ 각 숫자의 위치는 바꿀 수 없기 때문에 선형적으로 생각해서 최대 숫자를 만들어내야 한다.

    - 가장 앞에서부터 탐색을 진행하며 숫자를 판단한다.


2️⃣ 스택을 이용해서 선형 시간안에 가장 큰 숫자를 만들어 낼 수 있다.

    - 현재 숫자가 스택의 Top 에 위치한 숫자보다 크다면, 그렇지않을 때까지 계속해서 스택을 비워낸다.

    - 그리고 나서 현재 숫자를 넣어준다.

    - 만약 Top 의 숫자보다 작거나 같다면 일단 스택에 넣어둔다.


3️⃣ 이때, 뒤의 남은 숫자의 개수와 스택에 저장된 숫자의 개수를 잘 판단해야한다.

    - Top의 숫자보다 더 큰 숫자를 넣어야할 때, 남아있는 후보 숫자의 개수와 현재 스택에 저장된 숫자의 개수를 파악한다.

    - 남아있는 후보 숫자 개수와 스택의 현재 사이즈의 합이 최종적으로 만들어야 하는 숫자의 사이즈보다 커야 스택을 비울 수 있다.

    - 따라서 해당 조건을 처리하여 스택을 비워줘야 한다.

    - Top의 숫자보다 더 작은 숫자를 넣어야할 때는 현재 스택의 사이즈가 최종적으로 만들어야 하는 숫자의 사이즈보다 작을 때만 넣어준다.


4️⃣ 최종적으로 만들어진 숫자는 스택을 거꾸로 꺼내서 만들 수 있다.

    - StringBuilder를 이용해서 앞쪽에 스택에서 꺼낸 숫자를 덧붙여준다.

## 실수 😅
<hr/>

- 개수를 맞춰주는 비교에서 인덱스 하나씩 놓쳐서 디버깅을 통해 해결할 수 있었다.