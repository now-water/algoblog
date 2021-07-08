---
title: '2092. 집합의 개수'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['DP']
date: '2021-07-02'
---

# 문제
- [2092. 집합의 개수](https://www.acmicpc.net/problem/2092)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Q2092 {
    static int T, A, S, B;
    static int arr[], dp[][];
    static final int mod = 1000000;
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int ans = 0;

        // dp[i][j] : 1~i까지 숫자를 사용해서 j개의 원소를 갖는 집합의 수
        
        // i 를 j번 사용해서 만들 수 있는 경우를 다 더해줌
        for (int i = 1; i <= T; i++) {
            for (int j = 0; j <= arr[i]; j++) {
                dp[i][j] = 1;
            }
        }

        for (int i = 2; i <= T; i++) {
            for (int j = 1; j <= B; j++) {
                for (int k = 0; k <= arr[i]; k++) {
                    if(j - k > 0) {
                        // i까지의 수로 구성된 j개의 원소를 갖는 집합의 개수는
                        // i를 k개 썼을 때, i-1까지 숫자로 j-k 개의 원소를 갖는 만든 집합의 수와 같다
                        dp[i][j] = (dp[i][j] + dp[i-1][j-k]) % mod;
                    }
                }
            }
        }

        for (int i = S; i <= B; i++) {
            ans = (ans + dp[T][i]) % mod;
        }
        System.out.println(ans);
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        T = stoi(st.nextToken());
        A = stoi(st.nextToken());
        S = stoi(st.nextToken());
        B = stoi(st.nextToken());
        arr = new int[T+1];
        dp = new int[T+1][A+1];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < A; i++) {
            arr[stoi(st.nextToken())] += 1;
        }
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}
```
</details>

## ⭐️느낀점⭐️

> 캐싱할 대상을 찾아내는 것이 어려웠다. 
> 
> 결국 정답자의 코드를 보면서 이해하려고 했는데, 참고한 2 곳의 블로그 모두 코드가 같았다.
> 
> 하지만 나로서는 그 코드들이 타당하지 않다고 생각해서 1시간 반동안 고민한 끝에 더 최적화한 코드를 구현할 수 있었다.


## 풀이 📣
<hr/>

1️⃣ 입력받은 수의 카운트를 세어준다.


2️⃣ `dp[T][K]` 를 이용해서 부분 정답을 캐싱하였다.

    - dp[T][K] : 1~T 까지 숫자를 K 개 갖는 집합의 개수

    - 현재 T까지 숫자를 이용해서 K를 고를 수 있는데, T를 k(0~arr[T]) 개만큼 사용했을 때의 개수는 dp[T-1][K-k] 개 이다.

    - 처음에 각 숫자별로 그 숫자만 이용해서 만들 수 있는 집합의 개수를 모두 더해줬다. 
    
     for(int i=1; i<T; ++i) for(int j=0; j<= arr[i]; ++j) (dp[i][j] = 1)


3️⃣ 문제의 조건에 따라서 1~T 숫자를 사용해서 k 개의 원소를 갖는 집합의 개수를 찾아서 출력한다.

    - for(int k=S; k <= B; ++k) ans += dp[T][k];


## 실수 😅
<hr/>

- 처음에 문제를 잘못 읽어서 T를 고려하지 않았다.

- 이후 2차원 캐시를 설정해주는 방법을 떠올리지 못했었다. => 이해하는데까지 시간이 꽤나 걸렸다.