public class Error {

    public static void main(String[] args) {
        System.out.println("[main] start");

        try {
            controller(args);
            System.out.println("[main] 정상 종료");
        } catch (Exception e) {
            System.out.println("[main] catch 실행: " + e.getClass().getSimpleName());
        }

        System.out.println("[main] end");
    }

    static void controller(String[] args) {
        System.out.println("[controller] 호출됨");
        service(args);
        System.out.println("[controller] 종료");
    }

    static void service(String[] args) {
        System.out.println("[service] 호출됨");
        repository(args);
        System.out.println("[service] 종료");
    }

    static void repository(String[] args) {
        System.out.println("[repository] 호출됨");

        if (args.length == 0) {
            throw new IllegalArgumentException("인자 없음");
        }

        System.out.println("[repository] 정상 처리");
    }
}

