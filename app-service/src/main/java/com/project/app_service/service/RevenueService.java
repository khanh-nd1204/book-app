package com.project.app_service.service;

import com.project.app_service.model.dto.RevenueChartDTO;
import com.project.app_service.model.dto.RevenueSummaryDTO;
import com.project.app_service.model.dto.TopProductDTO;
import java.time.Instant;
import java.util.List;

public interface RevenueService {
  RevenueSummaryDTO getSummary(Instant from, Instant to) throws Exception;

  List<RevenueChartDTO> getChart(Instant from, Instant to, String groupBy) throws Exception;

  public List<TopProductDTO> getTopProducts(Instant from, Instant to, int limit) throws Exception;
}
