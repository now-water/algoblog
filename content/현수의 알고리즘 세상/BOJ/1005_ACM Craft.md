---
title: '1005. ACM Craft'
metaTitle: '만렙 개발자 키우기'
metaDescription: '알고리즘 문제를 풀고 정리한 곳입니다.'
tags: ['위상정렬', 'DP', '그래프 탐색']
date: '2021-03-19'
---

# 문제

- [1005 ACM Craft](https://www.acmicpc.net/problem/1005)

## 코드

<details><summary> 코드 보기 </summary>

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class Q1005 {
    static int n, k, w, inDegree[], time[];
    static List<Integer> adj[];
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int tc = Integer.parseInt(st.nextToken());
        while(tc-- > 0){
            init(br, st);
            solution();
        }

    }

    static void solution() {
        Queue<Integer> q = new LinkedList<>();
        int result[] = new int[n + 1];

        for (int i = 1; i <= n; i++) {
            if(inDegree[i] == 0) {
                q.add(i);
                result[i] = time[i];
            }
        }
        while(!q.isEmpty()){
            int here = q.poll();
            for (int next : adj[here]) {
                inDegree[next] -= 1;
                if(inDegree[next] == 0) q.add(next);
                result[next] = Math.max(result[next], result[here] + time[next]);
            }
        }
        System.out.println(result[w]);
    }

    static void init(BufferedReader br, StringTokenizer st) throws IOException {
        st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        k = Integer.parseInt(st.nextToken());
        time = new int[n + 1];
        adj = new List[n + 1];
        inDegree = new int[n + 1];
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= n; i++) {
            adj[i] = new ArrayList<>();
            time[i] = Integer.parseInt(st.nextToken());
        }
        for (int i = 0; i < k; i++) {
            st = new StringTokenizer(br.readLine());
            int s = Integer.parseInt(st.nextToken());
            int d = Integer.parseInt(st.nextToken());
            adj[s].add(d);
            inDegree[d] += 1;
        }
        w = Integer.parseInt(br.readLine());
    }
}
```

</details>

## ⭐️느낀점⭐️

> 위상 정렬 문제를 처음 풀어봤다. DFS 로 쑥 드가서 나오면서 저장하는 방식으로 수업 때 배웠던 것 같은데 전혀 다른 방법이어서 조금 당황스러웠다.

## 풀이 📣

<hr/>

1️⃣ 각 노드들은 진입 차수`inDegree`를 가지고 있고, 노드에서 필요로 하는 시간 `time`도 가지고 있다.

    - 해당 노드를 방문하면 걸리는 시간이 time 배열에 저장되어 있다.

    - 진입 차수는 해당 노드로 연결되어 들어오는 노드들의 개수를 저장한다.

    - 각 노드별로 건너갈 수 있는 노드들을 리스트 안에 저장한다.

2️⃣ 진입 차수가 0인 노드만 방문할 수 있다.

    - 진입 차수가 0인 노드를 처음에 큐에 모두 삽입한다.

    - 큐에서 꺼낸 노드에서 갈 수 있는 노드들을 인접 리스트를 통해 차례로 처리한다.

3️⃣ 현재 탐색 중인 노드에서 연결된 모든 간선을 제거하고, 건너갈 수 있는 노드 `next` 의 진입 차수를 1만큼 감소시킨다.

    - 만약 감소한 진입 차수가 0이 되면 그 노드로 이동이 가능해지므로, 큐에 삽입해준다.

    - 다음 노드까지의 총 걸리는 시간은 result 배열에 저장한다.

    - 원래 저장되어 있던 값과 새로 갱신되는 값 중 더 큰 값을 result 배열에 저장해준다.

4️⃣ 모든 노드에 대해 위의 과정을 반복한 후, 최종적으로 건설해야하는 건물 `w` 을 짓기까지 걸리는 시간`result[w]`을 출력한다.
