---
title: '9489. 사촌'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['트리']
date: '2021-07-10'
---

# 문제
- [9489. 사촌](https://www.acmicpc.net/problem/9489)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Q9489 {
    static int n, k, arr[], parent[];
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        while(true) {
            if (init(br)) break;
            if(n == 1 || k == 1){
                System.out.println(0);
                continue;
            }
            solution();
        }
    }

    private static void solution() {
        parent = new int[n + 1];
        int target = grouping();
        System.out.println(sibling(target));
    }

    private static int sibling(int target) {
        int ret = 0;
        for (int i = 1; i <= n; i++) {
            if(parent[i] != parent[target] && parent[parent[i]] == parent[parent[target]])
                ret += 1;
        }
        return ret;
    }

    private static int grouping() {
        int target = 0, group = 0;
        parent[0] = -1;
        parent[1] = 0;
        for (int i = 1; i < n; i++) {
            if(arr[i] == k) target = i + 1;
            if(arr[i] != arr[i-1] + 1)
                group += 1;
            parent[i + 1] = group;
        }
        return target;
    }

    private static boolean init(BufferedReader br) throws IOException {
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = stoi(st.nextToken());
        k = stoi(st.nextToken());
        if(n == 0 && k == 0) return true;
        st = new StringTokenizer(br.readLine());
        arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = stoi(st.nextToken());
        }
        return false;
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}
```
</details>

## ⭐️느낀점⭐️

> 인덱스를 0부터 설정해서 틀렸다.. 트리는 그냥 무조건 인덱스 1부터 설정하는게 마음 편할 듯 하다.

## 풀이 📣
<hr/>

1️⃣ 값이 1 차이가 나는 그룹으로 묶어준다. 

    - 값이 1 보다 더 크게 차이가 난다면 서로 다른 그룹으로 묶인다.


2️⃣ 두 노드 간에 사촌 여부를 파악하기 위해서는 다음의 조건을 만족해야 한다. 

    - 두 노드는 서로 부모가 달라야 한다. 

    - 두 노드의 부모들은 같은 부모를 공유해야 한다.


3️⃣ 1번에서 그룹핑을 수행하고, 2번에서 사촌 여부를 파악하여 주어진 노드의 사촌의 수를 출력해준다.


## 실수 😅
<hr/>

- 트리 인덱스를 0부터 설정해서 계속 한 칸씩 밀려서 계산됐다.


- 그룹핑을 수행하는데, 구별되는 그룹 번호가 정확히 부모를 가리키는 이유는 밝히지 못하고 그냥 귀납적으로 찾아냈다.