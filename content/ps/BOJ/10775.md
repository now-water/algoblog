---
title: '10775. 공항'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['자료구조', '그리디', '분리집합']
date: '2021-06-25'
---

# 문제
- [10775. 공항](https://www.acmicpc.net/problem/10775)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Q10775 {
    static int G, P;
    static int planes[], parent[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int ans = 0;
        for (int i = 1; i <= P; i++) {
            int dest = planes[i];
            int openGate = find(dest);

            // 도킹이 가능한 게이트가 없는 경우 종료
            if(openGate <= 0) break;

            // openGate 번째 게이트는 다음 가능한 게이트를 가리킨다.
            parent[openGate] = find(openGate - 1);
            ans += 1;
        }
        System.out.println(ans);
    }

    private static int find(int p) {
        if(parent[p] == p) return p;
        return parent[p] = find(parent[p]);
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        G = stoi(br.readLine());
        P = stoi(br.readLine());
        planes = new int[P+1];
        parent = new int[G+1];
        for (int i = 1; i <= G; i++) {
            parent[i] = i;
        }
        for (int i = 1; i <= P; i++) {
            planes[i] = stoi(br.readLine());
        }
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}

```
</details>

## ⭐️느낀점⭐️ 
> 그리디 + 유니온 파인드 라는 생각을 떠올리지 못하였다.
> 
> 확실히 그리디 유형에 약한 거 같다.
> 
> 유니온-파인드를 활용한 접근법을 배울 수 있었던 좋은 문제였다.


## 풀이 📣
<hr/>

1️⃣ 각 비행기가 도달 가능한 게이트 중에서 가장 숫자가 큰 게이트부터 도킹한다.

    - 모든 비행기가 전부 가장 큰 숫자부터 도킹함으로써 그리디스럽게 최대한 많은 비행기를 도킹시킬 수 있다.


2️⃣ 만약 이미 다른 비행기가 해당 게이트에 도킹을 완료했다면, 다음 게이트에 도킹한다.

    - 다음 게이트는 도킹하려 하였던 게이트가 가리키는 방향(아직 도킹이 되지 않은 게이트)에 도킹한다.

    - 도킹을 완료하면, 해당 게이트는 (현재 위치 - 1) 번째 게이트를 확인해보고, 가능하다면 그곳에 도킹한다.

    - 만약 다음 위치에도 도킹이 불가능하다면, (다음 위치 - 1) 번째 게이트를 다시 확인해본다. 이러한 과정을 거침으로써 도킹이 가능한 게이트를 찾을 수 있다.

    - 이때 한칸씩 옮겨가며 도킹이 가능한 게이트를 찾는 것은 비효율적이다.

    - 따라서 다음 도킹이 가능한 위치를 바로 가리키기 위하여 유니온-파인드를 적용할 수 있다.


3️⃣ 유니온-파인드를 사용하여 다음 도킹이 가능한 위치를 바로 찾아낸다.

    - 처음 각 게이트의 부모는 자기 자신을 가리키도록 설정한다.

    - 이후 게이트에 도킹이 완료되면 (현재 게이트 - 1) 번째 게이트의 부모를 현재 게이트의 부모로 설정한다.


4️⃣ 더 이상 도킹이 불가능한 비행기가 발생한다면 현재까지 도킹한 비행기 수를 출력하고 종료한다.

## 실수 😅
<hr/>

- 처음엔 문제가 잘 이해가 되지 않아서 오래 고민하였다.

- 도킹이 가능한 게이트를 모두 탐색하는 것은 시간초과가 발생할 것이라 예상하였다.

- 하지만 그 외의 방법을 떠올리지 못했고, 유니온-파인드 + 그리디 라는 힌트를 얻어서 바로 풀 수 있었다. 
 
