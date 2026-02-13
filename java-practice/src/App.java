//import com.koreanit.spring.FakeUserService;
import com.koreanit.spring.UserController;
import com.koreanit.spring.UserRepository;
import com.koreanit.spring.UserService;

import java.util.HashMap;
import java.util.Map;

public class App {

    public static void main(String[] args) {
        // 1) 객체 생성 + 연결
        UserRepository repository = new UserRepository();
        UserService service = new UserService(repository);
        UserController controller = new UserController(service);

        // 2) 요청 body 생성
        Map<String, Object> body = new HashMap<>();
        if (args.length > 0) body.put("username", args[0]);

        // 3) 호출 + 최종 처리
        try {
            String result = controller.hello(body);
            System.out.println("[App] result = " + result);
        } catch (Exception e) {
            System.out.println("[App] 예외 발생: " + e);
        }

        System.out.println("[App] 정상 종료");
    }
}