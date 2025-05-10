package com.example.javaservice.controller;

import com.example.javaservice.model.Clause;
import com.example.javaservice.model.ContractRequestBody;
import com.example.javaservice.service.PdfService;
import com.example.javaservice.service.QnAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class TesteController {

	@Autowired
	private QnAnswerService qnAnswer;

	@Autowired
	private PdfService pdfService;
	
	@GetMapping("/ai")
	public String heloAtualizado() {
		return "Hello com ia!";
	}
	
	@PostMapping("/ai")
	public ResponseEntity<List<Clause>> textAnalysis(@RequestBody ContractRequestBody payload) {
		List<Clause> answer = qnAnswer.getAnswer(payload.contract());
		return ResponseEntity.ok(answer);
	}

	@PostMapping("/ai/pdf")
	public ResponseEntity<List<Clause>> pdfAnalysis(@RequestParam("file") MultipartFile file) {
		try {
			String pdfText = pdfService.extractTextFromPdf(file);
			List<Clause> answer = qnAnswer.getAnswer(pdfText);
			return ResponseEntity.ok(answer);
		} catch (IOException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
}

