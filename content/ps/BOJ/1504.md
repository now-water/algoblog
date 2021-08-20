---
title: '1504. 특정한 최단 경로'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['그래프 이론', '다익스트라']
date: '2021-08-15'
---

# 문제
- [1504. 특정한 최단 경로](https://www.acmicpc.net/problem/1504)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.awt.Point;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;
import java.util.StringTokenizer;

public class Q1504 {

    static int n, e, v1, v2, cost[];
    static List<Point> adj[];
    static boolean visited[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        long commonPath = getShortestCost(v1, v2);
        long p1 = getShortestCost(1, v1) + getShortestCost(v2, n);
        long p2 = getShortestCost(1, v2) + getShortestCost(v1, n);
        long shortest = Math.min(p1, p2) + commonPath;
        System.out.println(shortest >= Integer.MAX_VALUE ? -1 : shortest);
    }

    private static long getShortestCost(int u, int v) {
        PriorityQueue<Point> pq = new PriorityQueue<Point>((a, b)->(a.y - b.y));
        pq.add(new Point(u, 0));
        cost = new int[n+1];
        Arrays.fill(cost, Integer.MAX_VALUE);
        cost[u] = 0;
        while(!pq.isEmpty()){
            Point p = pq.poll();
            int cur = p.x, curCost = p.y;
            if(cost[cur] < curCost) continue;

            for (Point next : adj[cur]) {
                if(cost[next.x] > curCost + next.y){
                    cost[next.x] = curCost + next.y;
                    pq.add(new Point(next.x, curCost + next.y));
                }
            }
        }
        return cost[v];
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = stoi(st.nextToken());
        e = stoi(st.nextToken());
        adj = new List[n+1];
        for (int i = 0; i < n+1; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int i = 0; i < e; i++){
            st = new StringTokenizer(br.readLine());
            int u = stoi(st.nextToken());
            int v = stoi(st.nextToken());
            int c = stoi(st.nextToken());
            adj[u].add(new Point(v, c));
            adj[v].add(new Point(u, c));
        }
        st = new StringTokenizer(br.readLine());
        v1 = stoi(st.nextToken()); v2 = stoi(st.nextToken());
    }

    private static int stoi(String str) {
        return Integer.parseInt(str);
    }
}
```
</details>

## ⭐️느낀점⭐️
> 처음에 떠올린 방법은 1->v1->v2->N 과 1->v2->v1->N 중 더 짧은 경로를 구하는 것이었다.
> 
> 하지만 이 방법이 타당한지 검증하느라 조금 시간이 걸렸다.

## 풀이 📣
<hr/>

1️⃣ u -> v 까지의 최단경로를 구하는 다익스트라 메소드를 만든다.


2️⃣ 이후 1->v1->v2->N 과 1->v2->v1->N 의 최단 경로 합을 구한다.

    - 각 노드의 최단경로 초기 값은 Integer.MAX_VALUE 를 넣어둔다.

    - v1 <-> v2 는 어차피 동일하므로, 최적화를 위해 한 번 계산해 둔 후 재사용하였다.


3️⃣ 만약 경로가 존재하지 않으면 초기값인 `Integer.MAX_VALUE`를 반환한다.

    - 최종으로 구한 값이 Integer.MAX_VALUE 를 넘어가면 경로가 존재하지 않았다는 의미이므로 -1을 출력시킨다.

    - 왜냐하면 전체 간선이 200,000 개 이고, 최대 비용은 1,000 이므로 단일 최단 경로의 최대 비용은 200,000 * 1,000 = 200,000,000 이라서 "특정한 최단 경로"의 최대 비용은 Integer.MAX_VALUE를 넘을 수 없다.

## 실수 😅
<hr/>

- 다익스트라를 오랜만에 짜봐서 `visited` 배열도 사용했었다. 이후에 필요없다는걸 알고 제거함.

- 처음 우선순위 큐에 시작점에서 연결된 모든 지점으로의 간선을 넣고 시작했었다.. => 이후 `new Point(시작점, 0)` 값만 넣어두는 것으로 변경해 AC를 받을 수 있었다. 