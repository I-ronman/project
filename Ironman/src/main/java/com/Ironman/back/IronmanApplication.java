package com.Ironman.back;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IronmanApplication {

	public static void main(String[] args) {
		// 먼저 dotenv 로드
				Dotenv dotenv = Dotenv.configure().load();
				System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
				System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
		
		SpringApplication.run(IronmanApplication.class, args);
	}

}
