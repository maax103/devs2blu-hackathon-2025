package com.example.javaservice.service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.javaservice.model.Clause;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class QnAnswerService {

	private final String API_LINK = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
	private final String API_VALUE = System.getenv("API_KEY");
	private final String FULL_URL = API_LINK + API_VALUE;

	private final WebClient webClient;

	public QnAnswerService(WebClient.Builder webBuilder) {
		this.webClient = webBuilder.build();
	}

	public List<Clause> getAnswer(String payload) {

		String persona = "Você tem mais de três décadas de conhecimento em Direito Contratual possui um " +
				"olhar apurado para identificar ambiguidades e omissões em contratos. Sua análise minuciosa se concentra " +
				"em garantir a clareza e a segurança jurídica. A IA verifica a conformidade legal, avalia a objetividade da " +
				"linguagem e a completude das cláusulas, antecipando potenciais litígios. Sua função é identificar imprecisões " +
				"e sugerir correções para assegurar a proteção dos interesses das partes envolvidas, sempre de forma objetiva (3° pessoa) e " +
				"imparcial. Responda no seguinte formato: " +
				"[{ \"clauseId\": \"id\", \"number\": 1, \"title\": \"Título\", \"text\": \"Texto da cláusula\", \"riskLevel\": \"Alto\", " +
				"\"categories\": [\"Categoria1\"], \"issues\": [\"Problema1\"], \"recommendations\": [\"Recomendação1\"] }]";

		String question = persona + payload;

		List<Map<String, Object>> contents = List.of(Map.of("parts", List.of(Map.of("text", question))));
		Map<String, Object> requestBody = Map.of("contents", contents);

		String response = webClient.post().uri(FULL_URL).header("Content-Type", "application/json")
				.bodyValue(requestBody).retrieve().bodyToMono(String.class).block();

		List<Clause> clauses = new ArrayList<>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode rootNode = objectMapper.readTree(response);

			JsonNode candidatesNode = rootNode.path("candidates");
			if (candidatesNode.isArray() && !candidatesNode.isEmpty()) {
				JsonNode textNode = candidatesNode.get(0).path("content").path("parts").get(0).path("text");
				if (textNode.isTextual()) {
					String text = textNode.asText();
					text = text.replace("```json", "");
					text = text.replace("```", "");
					System.out.println(text);
					clauses = objectMapper.readValue(text, objectMapper.getTypeFactory().constructCollectionType(List.class, Clause.class));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return clauses;
	}
}
