import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

class Pair {
    int fishIdx, when;

    public Pair(int fishIdx, int when) {
        this.fishIdx = fishIdx;
        this.when = when;
    }
}
class Shark {
    int x, y, dir;

    public Shark(int x, int y, int dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
}
public class Q19237 {
    static int n, m, k, board[][], dx[] = {0, -1, 1, 0, 0}, dy[] = {0, 0, 0, -1, 1};
    static int priority[][][];
    static Pair smell[][];
    static Shark shark[];
    static boolean dead[];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        int time = 0;
        while (time++ <= 1000) {
            // 냄새를 뿌림 - 냄새를 뿌린 상어와 시각을 저장
            bbung(time);

            // 상어 이동 - 현재 방향에 따른 우선순에 따라 방향 선택
            sharkMove(time);

            // 겹치는 상어 쫓아냄 - 숫자가 낮을수록 강하다.
            kick();

            // 종료 조건 : 번호가 1인 상어만 board 안에 존재.
            if (isFinished(dead)) break;
        }
        if(time > 1000) System.out.println(-1);
        else System.out.println(time);
    }

    private static void bbung(int time) {
        for (int i = 1; i <= m; i++) {
            if(dead[i]) continue;
            smell[shark[i].x][shark[i].y] = new Pair(i, time);
        }
    }

    private static void kick() {
        int state[][] = new int[n][n];
        for (int i = 1; i <= m; i++) {
            if(dead[i]) continue;
            Shark it = shark[i];
            int x = it.x, y = it.y;
            if(state[x][y] > 0){ // 이미 다른 상어가 들어 있다면
                if(state[x][y] > i){
                    dead[state[x][y]] = true;
                    state[x][y] = i;
                    board[x][y] = i;
                }
                else dead[i] = true;
            }
            else {
                state[x][y] = i; // 빈 칸이면 현재 상어 저장
                board[x][y] = i;
            }
        }
    }

    private static void sharkMove(int time) {
        for (int i = 1; i <= m; i++) {
            if(dead[i]) continue;
            Shark it = shark[i];
            boolean canGo = false;
            for (int j = 1; j <= 4; j++) {
                int dir = priority[i][it.dir][j];
                int nx = it.x + dx[dir], ny = it.y + dy[dir];
                if (!isBorder(nx, ny)) continue;

                // 아직 냄새가 남아 있는지 확인
                if (smell[nx][ny] != null) {
                    if (time - smell[nx][ny].when >= k) {
                        canGo = true;
                    } else continue;
                }
                else {
                    canGo = true;
                }
                if (canGo) {
                    board[it.x][it.y] = 0;
                    board[nx][ny] = i;
                    it.x = nx;
                    it.y = ny;
                    it.dir = dir;
                    break;
                }
            }
            if (!canGo) { // 자신의 냄새가 있는 방향으로 이동
                for (int j = 1; j <= 4; j++) {
                    int dir = priority[i][it.dir][j];
                    int nx = it.x + dx[dir], ny = it.y + dy[dir];
                    if(isBorder(nx, ny) && smell[nx][ny].fishIdx == i) {
                        board[it.x][it.y] = 0;
                        it.x += dx[dir];
                        it.y += dy[dir];
                        it.dir = dir;
                        board[it.x][it.y] = i;
                        break;
                    }
                }
            }
        }
    }

    private static boolean isFinished(boolean[] dead) {
        for (int i = 2; i <= m; i++) if (!dead[i]) return false;
        return true;

    }

    private static boolean isBorder(int x, int y) {
        return (x >= 0 && x < n && y >= 0 && y < n);
    }

    static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());
        k = Integer.parseInt(st.nextToken());

        shark = new Shark[m + 1];
        board = new int[n][n];
        priority = new int[m + 1][5][5];
        smell = new Pair[n][n];
        dead = new boolean[m + 1];

        for (int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine());
            for (int j = 0; j < n; j++) {
                board[i][j] = Integer.parseInt(st.nextToken());
                if (board[i][j] != 0)
                    shark[board[i][j]] = new Shark(i, j, 0);
            }
        }
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= m; i++) shark[i].dir = Integer.parseInt(st.nextToken());
        for (int s = 1; s <= m; s++) {
            for (int dir = 1; dir <= 4; dir++) {
                st = new StringTokenizer(br.readLine());
                for (int p = 1; p <= 4; p++)
                    priority[s][dir][p] = Integer.parseInt(st.nextToken());
            }
        }
    }
}