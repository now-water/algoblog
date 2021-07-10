---
title: '6137. 문자열 생성'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그리디', '투 포인터']
date: '2021-07-09'
---

# 문제
- [6137. 문자열 생성](https://www.acmicpc.net/problem/6137)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class Q6137 {
    static int n;
    static char line[];

    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() throws IOException {
        int left = 0, right = n - 1, blockCount = 0;
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));

        while (left <= right) {
            if(line[left] > line[right]){
                bw.write(line[right--]);
            } else if(line[left] < line[right]){
                bw.write(line[left++]);
            } else {
                int pLeft = left, pRight = right;
                while(pLeft < pRight && line[pLeft] == line[pRight]){
                    pLeft += 1;
                    pRight -= 1;
                }
                if(line[pLeft] <= line[pRight]){
                    bw.write(line[left++]);
                } else {
                    bw.write(line[right--]);
                }
            }
            blockCount += 1;
            if(blockCount % 80 == 0) {
                bw.write('\n');
            }
        }
        bw.flush();
        bw.close();
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt(br.readLine());
        line = new char[n];
        for (int i = 0; i < n; i++) {
            line[i] = br.readLine().charAt(0);
        }
    }
}
/*
5
A
A
A
A
A


12
A
C
C
C
C
D
B
C
C
C
C
B
 */
```
</details>

## ⭐️느낀점⭐️

> O(N^2) 이라는 걸 알면서 왜 시간초과가 날거라고 생각했었는지 모르겠다..
> 
> 조금 더 효율적으로 짜야한다고 생각해서 조건을 계속 분기하고 로직이 복잡해졌는데, 통과를 못했다.
>
> 그냥 브루트포스로 푸니까 풀렸다. 

## 풀이 📣
<hr/>

1️⃣ 양 끝에 포인터를 두고 우선순위를 비교하며 더 사전 순서가 빠른 문자를 정답에 추가해준다.


2️⃣ 우선순위가 동일할 경우 시뮬레이션을 수행한다.

    - 새로운 포인터를 설정하고 우선순위가 동일한 경우 반복하며 한 칸씩 움직이며 순서를 비교해준다.

    - 만약 왼쪽 포인터가 오른쪽 포인터보다 커지거나, 우선순위가 동일하지 않다면 반복을 멈춘다.

    - 왼쪽의 값과 오른쪽 값을 비교해서 우선순위가 더 높은 문자를 추가해주고 해당 방향의 포인터를 한 칸 당겨준다.

    - 80번째 입력마다 개행을 추가해준다.


3️⃣ 기존 문자열 S 가 끝날 때까지 위의 과정을 반복한다.

    - 최종적으로 생성되는 문자열을 출력하고 종료한다.

## 실수 😅
<hr/>

- 효율성을 위해 포인터를 한 칸씩 움직이지 않고 연속되는 부분만큼 한 번에 이동시켜주도록 구현했었는데, 계속 18%에서 틀려서 방법을 바꿨다. 