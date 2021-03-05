# 문제
- [카카오 2021 블라인드 공개 채용. 3번 순위 검색](https://programmers.co.kr/learn/courses/30/lessons/72412)

## 코드

<details><summary> 코드 보기 </summary>

``` java
import java.util.*;

class Solution {
    static List<Integer> table[][][][] = new List[3][2][2][2];
    public int[] solution(String[] info, String[] query) {
        int[] answer = {};
        List<Integer> ans = new ArrayList<>();
        String infos[][] = new String[info.length][5];
        String queries[][] = new String[query.length][5];

        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 2; j++)
                for (int k = 0; k < 2; k++)
                    for (int l = 0; l < 2; l++)
                        table[i][j][k][l] = new ArrayList<>();

        /* parsing */
        for (int i = 0; i < query.length; i++) {
            String line = query[i];
            int start = 0;
            int end = line.indexOf(" ");
            for (int j = 0; j < 4; j++) {
                end = start + line.substring(start).indexOf(" ");
                queries[i][j] = line.substring(start, end);
                start = end + 5;
            }
            queries[i][4] = line.substring(end + 1);
        }
        for (int i = 0; i < info.length; i++) {
            infos[i] = info[i].split(" ");

            int lang = 0, job = 0, career = 0, food = 0;
            if(infos[i][0].equals("java")) lang = 1;
            else if(infos[i][0].equals("python")) lang = 2;
            if(infos[i][1].equals("backend")) job = 1;
            if(infos[i][2].equals("senior")) career = 1;
            if(infos[i][3].equals("chicken")) food = 1;

            table[lang][job][career][food].add(Integer.parseInt(infos[i][4]));
        }

        /* sort for binary search */
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 2; j++)
                for (int k = 0; k < 2; k++)
                    for (int l = 0; l < 2; l++)
                        Collections.sort(table[i][j][k][l]);

        /* query */
        for (int i = 0; i < queries.length; i++) {
            int ls = 0, le = 0, js = 0, je = 0, cs = 0, ce = 0, fs = 0, fe = 0, score = 0;

            if(queries[i][0].equals("java")) ls = le = 1;
            else if(queries[i][0].equals("python")) ls = le = 2;
            else if(queries[i][0].equals("-")) {ls = 0; le = 2;}

            if(queries[i][1].equals("backend")) js = je = 1;
            else if(queries[i][1].equals("-")) { js = 0; je = 1; }

            if(queries[i][2].equals("senior")) cs = ce = 1;
            else if(queries[i][2].equals("-")) { cs = 0; ce = 1;}

            if(queries[i][3].equals("chicken")) fs = fe = 1;
            else if(queries[i][3].equals("-")) { fs = 0; fe = 1; }

            score = Integer.parseInt(queries[i][4]);

            int ansValue = 0;
            for (int j = ls; j <= le; j++) {
                for (int k = js; k <= je; k++) {
                    for (int l = cs; l <= ce; l++) {
                        for (int m = fs; m <= fe; m++) {
                            int n = table[j][k][l][m].size();
                            if(n == 0) continue;
                            int result = binSearch(table[j][k][l][m], score);
                            if(result == -1) continue;
                            ansValue += n - result;
                        }
                    }
                }
            }
            ans.add(ansValue);
        }

        answer = new int[ans.size()];
        for (int i = 0; i < ans.size(); i++)
            answer[i] = ans.get(i);
        return answer;
    }

    private static int binSearch(List<Integer> here, int score) {
        int left = 0, right = here.size() - 1;
        if(here.get(right) < score) return -1;
        while(left <= right){
            int mid = (left + right)/2;
            if(here.get(mid) < score) left = mid + 1;
            else right = mid - 1;
        }
        return left;
    }
}
```

</details>

## ⭐️느낀점⭐️
> 풀면서 이렇게 푸는게 맞나.. 하면서 했는데 정확성 다 맞고 효율성 2개뺴고 다 맞는거 보고 다행이다 싶었다. -> 이분탐색을 떠올리긴 했는데 어떤 식으로 적용해야할지 몰라서 구현하지 못했다 ..ㅜㅜ
> 
> 구현 문제를 많이 풀었었는데 그게 도움이 많이 됐던 것 같다.
> 
> 문자열 파싱하는 부분이 아직 좀 부족하단걸 느꼈다.

## 풀이 📣
<hr/>

1️⃣ 입력된 정보를 최대한 조회하기 쉽도록 하기 위해 4차원 리스트 배열을 만들어서 각 카테고리별로 파싱해서 분류하였다.

    - List<Integer> table[][][][] = new List[3][2][2][2]; // [언어][직군][경력][소울푸드]


2️⃣ 쿼리 중간에 ` and ` 부분을 문자의 인덱스를 +5 씩 해주면서 부분 문자열로 만들고, 다음 ` ` 의 인덱스를 구해서 부분 문자열을 잘라내었다.

    - end = start + line.substring(start).indexOf(" ");

    - line.substring(start, end); // 중간에 포함되는 정보들

    - 마지막에 점수는 and 로 연결되지 않으므로 end + 1 부터 substring을 구하면 된다.


3️⃣ 각 카테고리별로 저장된 데이터들을 이분 탐색하기 위해 오름차순으로 정렬한다. 

    - Collections.sort(table[i][j][k][l]);


4️⃣ 카테고리별 저장된 인원 수 중 쿼리로 들어오는 점수 이상을 받는 인원을 이분탐색으로 찾아낸다. 

    - ansValue += (n - binSearch(table[j][k][l][m], score));

<hr/>

## 실수 😅
- 효율성 테스트를 다 맞추기 위해서는 인원 수를 세어줄 때 이분탐색을 사용해야했다.

- 그냥 모조리 세어서 시간초과가 발생하였던 것 같다.