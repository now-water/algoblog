---
title: '1464. 뒤집기3'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그리디', '문자열']
date: '2021-07-25'
---

# 문제
- [1464. 뒤집기3](https://www.acmicpc.net/problem/1464)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Q1464 {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder line = new StringBuilder(br.readLine());

        if (line.length() == 1) {
            System.out.println(line.charAt(0));
            return;
        }
        solution(line);
    }

    private static void solution(StringBuilder line) {
        /*
        더 간단한 구현
        StringBuilder sb = new StringBuilder(line.charAt(0) + "");

        for (int i = 1; i < line.length(); i++) {
            if(sb.charAt(i - 1) < line.charAt(i)){
                sb = sb.reverse();
                sb = sb.append(line.charAt(i)).reverse();
            } else {
                sb.append(line.charAt(i));
            }
        }
        System.out.println(sb.reverse());
        */
        for (int i = 0; i < line.length() - 1; i++) {
            if (line.charAt(i) < line.charAt(i + 1)) {
                // i 번째 문자를 i + 1 로 밀기
                line = new StringBuilder(line.substring(0, i + 1)).reverse()
                    .append(line.substring(i + 1));
                line = new StringBuilder(line.substring(0, i + 2)).reverse()
                    .append(line.substring(i + 2));
            }
        }
        // 최종적으로 만들어진 문자열은 가장 우선순위가 빠른 문자가 가장 뒤로 밀려있음
        System.out.println(line.reverse());
    }
}
```
</details>

## ⭐️느낀점⭐️
> 뒤집는 로직을 어떻게 그리디하게 해야할지 막막했다.
> 
> 브루트포스로 O(N^2) 시간에 해결할 수 있을 것 같았지만, 메모리가 터져버렸다

## 풀이 📣
<hr/>

1️⃣ 가장 우선순위가 빠른 문자(가장 작은 문자)를 가장 오른쪽으로 계속 밀면서 문자열을 만든다.

    - A(k) 와 A(k+1) 중에, 더 작은 숫자를 오른쪽으로 계속 저장한다.


2️⃣ 그러기 위해서는 다음과 같이 두 번의 뒤집기가 필요하다.

    - A(k) < A(k+1) 인 경우, K번째에 가장 작은 문자가 저장되어 있는 문자열 중 0 부터 K 까지를 뒤집는다.

    - 그럼 가장 작은 문자는 0번째에 저장되고, K + 1 번째 문자를 그 뒤에 추가해준다.

    - 이후 다시 0 부터 K + 1 까지 뒤집어주면 K + 1 번째에 가장 작은 문자가 계속 유지된다.


3️⃣ 위의 과정을 계속 반복해주면 사전에서 늦은 문자부터 차례로 정렬되어 있다.

    - 따라서 문자열을 뒤집어서 출력해주면 사전 순으로 가장 먼저 나오는 순서대로 문자열이 만들어진다.

## 실수 😅
<hr/>

- 문자열 관련해서 연산이 많이 수행되어 StringBuilder 로 최적화를 시도해봤지만 그래도 중간 과정에서 String이 사용되어 메모리 초과가 발생했다.


- 결국 핵심인 뒤집기 로직을 한 번에 떠올리지 못했다.


- 그리고 뒤집기 로직도 전체 문자열 대상이 아니라, 하나씩 만들어가면서 뒤집어주면 훨씬 간결해진다는 것을 창묵이 코드를 보고 배울 수 있었다.