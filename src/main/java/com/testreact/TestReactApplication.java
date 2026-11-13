package com.testreact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * <pre>
 * testReact 서버. 화면(React)은 frontend/ 에서 빌드해 static/ 으로 함께 내보내고, 서버는 /api/** REST만 맡는다.
 * </pre>
 */
@SpringBootApplication
public class TestReactApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestReactApplication.class, args);
	}
}
