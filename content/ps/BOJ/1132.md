---
title: '1132. 합'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그리디']
date: '2021-06-22'
---

# 문제
- [1132. 합](https://www.acmicpc.net/problem/1132)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Collections;

public class Q1132 {
    static int n;
    static String arr[];
    static Long longs[] = new Long[10];
    static boolean head[] = new boolean[10];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        long sum = 0, value = 9;
        for (Long aLong : longs) {
            sum += aLong * value--;
        }
        System.out.println(sum);
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = Integer.parseInt(br.readLine());
        arr = new String[n];
        long inp[] = new long[10];
        for (int i = 0; i < n; i++) {
            arr[i] = br.readLine();
            int len = arr[i].length();
            long d = 1;
            for (int j = len - 1; j >= 0; --j, d *= 10) {
                inp[arr[i].charAt(j) - 'A'] += d;
            }
            head[arr[i].charAt(0) - 'A'] = true;
        }
        // 제일 앞자리가 아니고 기여도가 가장 낮은 알파벳에 0을 지정, 이후 나머지 알파벳들은 계산된 기여도에 의해 숫자를 지정
        // 0까지 다 안써도 되는 경우는 어차피 안쓰는 알파벳에 0이 저장될 것이고,
        // 0까지 다 써야하는 경우는 어차피 써야하니까 기여도가 가장 낮은 값에 0을 넣어주기 때문에 합당하다.
        long min = Long.MAX_VALUE;
        int victim = 0;
        for (int i = 0; i < 10; i++) {
            if(!head[i] && inp[i] < min) {
                victim = i;
                min = inp[i];
            }
        }
        inp[victim] = 0;

        longs = Arrays.stream(inp).boxed().toArray(Long[]::new);
        Arrays.sort(longs, Collections.reverseOrder());
    }
}
```
</details>

## ⭐️느낀점⭐️
> 생각하기 매우 어려운 문제였다..
> 
> 풀이를 보고 왜 결과가 그렇게 되는지를 알고 나서야 해당 접근 방법의 타당성을 입증할 수 있었다.


## 풀이 📣
<hr/>

1️⃣ 각 자리의 알파벳이 가지는 기여도를 계산한다.

    -  각 자릿수 만큼을 더해서 기여도를 계산한다.


2️⃣ 가장 앞 자리에 오는 알파벳은 0이 될 수 없다는 조건을 처리한다.

    - 그렇다면, 가장 앞 자리에 오지 않는 수 중에서 기여도가 가장 낮은 알파벳을 찾아 0으로 만들어버리면 된다.

    - 이때 2가지 경우가 존재한다. 

    - 모든 알파벳을 사용해서 0까지 다 매칭시켜야 하는 경우라면, 가장 앞 자리에 오지 않고 기여도도 가장 낮은 알파벳을 0으로 치환하면 합이 최대가 된다.  

    - 모든 알파벳을 사용하지 않아서 0을 매칭시키지 않아도 된다면, 사용하지 않는 알파벳(기여도가 0)에 0이 매칭될 것이다.

    - 따라서 해당 방법의 타당성을 입증할 수 있다.


3️⃣ 기여도가 높은 알파벳부터 9, 8, 7 ... 순으로 매칭시켜서 합을 구해준다.

    - 가장 기여도가 높은 알파벳에 큰 숫자를 부여할수록 최종 합이 더 커진다.


4️⃣ 구한 최대 합을 출력하고 종료한다.

## 실수 😅
<hr/>

- 느닷없이 Java 배열 내림차순 과정에서 막혀서 `stream` 을 찾아보았다. 모던 자바를 공부해야겠다.


- 알파벳을 기여도 순으로 순위를 메겼으나, 앞 자리 0이 되지 않는 조건을 처리하지 못하였다.