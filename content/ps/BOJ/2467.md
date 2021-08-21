---
title: '2467. 용액'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['이분 탐색', '투 포인터']
date: '2021-08-14'
---

# 문제
- [2467. 용액](https://www.acmicpc.net/problem/2467)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class Q2467 {
    static int n, arr[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int left = 0, right = n - 1;
        long la = arr[left], ra = arr[right], optimal = Math.abs(arr[left] + arr[right]);
        while(left < right){
            long sum = arr[left] + arr[right];
            long abs = Math.abs(sum);
            if(abs < optimal){
                la = arr[left]; ra = arr[right];
                optimal = abs;
            }
            if(sum < 0) left += 1;
            else right -= 1;
        }
        System.out.println(la + " " + ra);
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt(br.readLine());
        arr = Arrays.stream(br.readLine().split(" ")).mapToInt(Integer::parseInt).toArray();
        Arrays.sort(arr);
    }
}
```
</details>

## ⭐️느낀점⭐️
>  간단한 투 포인터 문제였다.

## 풀이 📣
<hr/>

1️⃣ 입력받은 숫자들을 오름차순으로 정렬한다.


2️⃣ 0에 가까운 숫자를 만들어야 하므로, 음수와 양수들를 하나씩 골라서 합을 구해본다.

    - 합을 구해서 0보다 작으면 음수의 절대값이 더 작은 값으로 비교해본다.

    - 합이 0보다 크다면 양수의 절대값이 더 작은 값으로 비교해본다.

    - 합의 절대값이 가장 작은 경우를 만들 때마다 그때의 각 음수와 양수를 저장해둔다.


3️⃣ left 값이 right 값보다 작을 때까지 반복하며 최적의 해를 구한다. 
