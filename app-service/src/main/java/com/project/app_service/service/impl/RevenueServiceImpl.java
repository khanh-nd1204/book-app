package com.project.app_service.service.impl;

import com.project.app_service.model.dto.RevenueChartDTO;
import com.project.app_service.model.dto.RevenueSummaryDTO;
import com.project.app_service.model.dto.TopProductDTO;
import com.project.app_service.repo.OrderRepo;
import com.project.app_service.service.RevenueService;
import java.time.Instant;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RevenueServiceImpl implements RevenueService {
  OrderRepo orderRepo;

  @Override
  public RevenueSummaryDTO getSummary(Instant from, Instant to) throws Exception {
    return orderRepo.getRevenueSummary(from, to);
  }

  @Override
  public List<RevenueChartDTO> getChart(Instant from, Instant to, String groupBy) throws Exception {
    String pattern = "%Y-%m-%d";
    if ("MONTH".equalsIgnoreCase(groupBy)) {
      pattern = "%Y-%m";
    }

    return orderRepo.getRevenueChart(from, to, pattern);
  }

  @Override
  public List<TopProductDTO> getTopProducts(Instant from, Instant to, int limit) throws Exception {
    Pageable pageable = PageRequest.of(0, limit);
    List<Object[]> result = orderRepo.getTopSellingProducts(from, to, pageable);

    return result.stream()
        .map(row -> new TopProductDTO((String) row[0], ((Number) row[1]).intValue()))
        .toList();
  }
}
