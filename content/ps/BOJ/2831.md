---
title: '2831. 댄스파티'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그리디', '정렬', '이분탐색']
date: '2021-07-28'
---

# 문제
- [2831. 댄스파티](https://www.acmicpc.net/problem/2831)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Q2831 {
    static final int PLUS = 0, MINUS = 1;
    static int n;
    static int men[], women[];
    static List<Integer> cand[];

    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int count = 0;
        for (int man : men) {
            int height = Math.abs(man);
            if(man > 0) count += findUpperBound(cand[MINUS], height);
            else count += findLowwerBound(cand[PLUS], height);
        }
        System.out.println(count);
    }

    private static int findLowwerBound(List<Integer> w, int h) {
        int left = 0, right = w.size();
        while(left < right){
            int mid = (left + right) / 2;
            if(w.get(mid) < h) left = mid + 1;
            else right = mid;
        }
        if(left == 0) return 0;
        w.remove(left - 1);
        return 1;
    }

    private static int findUpperBound(List<Integer> w, int h) {
        int left = 0, right = w.size();
        while(left < right){
            int mid = (left + right) / 2;
            if(w.get(mid) <= h) left = mid + 1;
            else right = mid;
        }
        if(left >= w.size()) return 0;
        w.remove(left);
        return 1;
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = stoi(br.readLine());
        men = new int[n];
        women = new int[n];
        cand = new List[2];
        for (int i = 0; i < 2; i++)
            cand[i] = new ArrayList<>();

        String[] mens = br.readLine().split(" ");
        String[] womens = br.readLine().split(" ");
        for (int i = 0; i < n; i++) {
            men[i] = stoi(mens[i]);
            women[i] = stoi(womens[i]);
            if(women[i] < 0) cand[MINUS].add(-women[i]);
            else cand[PLUS].add(women[i]);
        }
        Collections.sort(cand[PLUS]);
        Collections.sort(cand[MINUS]);
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}

```
</details>

## ⭐️느낀점⭐️
> 보자마자 10만 * 10만 이어서 이분 탐색으로 찾아야 한다고 생각했다.
> 
> 아이디어를 찾는 것 까지는 쉬웠으나, 아직 lower, upper bound 구하는 방법이 한 번에 안떠올라 조금 고민을 해야했다..

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

- bound 구하는 방식을 조금 더 빨리 활용할 수 있도록 해야겠다.


- 이분 탐색이 아니더라도, 우선순위 큐를 통해 각 조건에 맞는 사람들을 짝지어줄 수 있다.

    - 큰 키를 원하는 남성 가장 작은 남성과 작은 키를 원하는 가장 작은 여성의 키를 비교해서, 남자 키 < 여자 키 이면 매칭! 아니면 여자를 계속 poll 해서 찾아내는 방식
    
    - 작은 키를 원하는 남성과 큰 키를 원하는 여성도 마찬가지로 구해줄 수 있다.