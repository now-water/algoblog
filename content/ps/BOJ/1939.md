---
title: '1939. 중량제한'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['이분 탐색', '파라메트릭 서치', 'BFS', '그래프 탐색']
date: '2021-07-12'
---

# 문제
- [1939. 중량제한](https://www.acmicpc.net/problem/1939)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.awt.Point;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Q1939 {
    static int n, m, s, e;
    static List<Point> adjList[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int left = 0, right = 1000000000;
        int ans = 0;
        while(left <= right){
            int mid = (left + right) / 2;
            if(canSearchAbove(mid)) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        System.out.println(ans);
    }

    private static boolean canSearchAbove(int mid) {
        Queue<Integer> q = new LinkedList<>();
        q.add(s);
        boolean visited[] = new boolean[n + 1];
        visited[s] = true;
        while (!q.isEmpty()) {
            int cur = q.poll();
            for (Point p : adjList[cur]) {
                if(p.y < mid || visited[p.x]) continue;
                q.add(p.x);
                visited[p.x] = true;
                if(p.x == e) return true;
            }
        }
        return false;
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] in = br.readLine().split(" ");
        n = stoi(in[0]);
        adjList = new List[n + 1];
        for (int i = 1; i <= n; i++) {
            adjList[i] = new ArrayList<>();
        }
        m = stoi(in[1]);
        for (int i = 0; i < m; i++) {
            String[] line = br.readLine().split(" ");
            int u = stoi(line[0]), v = stoi(line[1]), c = stoi(line[2]);
            adjList[u].add(new Point(v, c));
            adjList[v].add(new Point(u, c));
        }
        in = br.readLine().split(" ");
        s = stoi(in[0]);
        e = stoi(in[1]);
    }

    private static int stoi(String s) {
        return Integer.parseInt(s);
    }
}

```
</details>

## ⭐️느낀점⭐️
> 처음에 문제를 보고 의욕이 안들었는데, 문제의 조건을 하나씩 따져보며 단서를 찾다가 단순 파라메트릭 서치 문제임을 파악했다. 
 
## 풀이 📣
<hr/>

1️⃣ 결국 어떠한 경로로 출발지에서 목적지까지 물건을 옮겨야 한다.

    - 그렇다면 그래프를 먼저 구성하고, 그래프 탐색이 핵심 알고리즘이다.


2️⃣ 가장 최대의 중량을 옮기기 위해서는, 경로 상에 가장 낮은 무게를 견딜 수 있는 다리가 최대가 되어야 한다.

    - 여기서 최소값의 최대화라는 키워드를 얻을 수 있었고, 곧바로 이것은 결정 문제로 바꿔 생각해서 최적화해야함을 알 수 있었다.
    

3️⃣ 따라서 바로 이분 탐색을 구현하여 파라미터를 통해 최대 물건의 중량을 구해준다.
