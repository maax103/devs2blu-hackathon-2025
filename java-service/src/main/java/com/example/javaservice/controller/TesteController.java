package com.example.javaservice.controller;

import java.util.List;
import java.util.Map;

import com.example.javaservice.model.Clause;
import com.example.javaservice.model.ContractRequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.javaservice.service.QnAnswerService;

@RestController
public class TesteController {

	@Autowired
	private QnAnswerService qnAnswer;
	
	@GetMapping("/ai")
	public String heloAtualizado() {
		return "Hello com ia!";
	}
	
	@PostMapping("/ai")
	public ResponseEntity<List<Clause>> helo(@RequestBody ContractRequestBody payload) {
		List<Clause> answer = qnAnswer.getAnswer(payload.contract());
		return ResponseEntity.ok(answer);
	}
	
}
