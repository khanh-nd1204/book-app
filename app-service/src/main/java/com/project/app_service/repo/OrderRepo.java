package com.project.app_service.repo;

import com.project.app_service.model.dto.RevenueChartDTO;
import com.project.app_service.model.dto.RevenueSummaryDTO;
import com.project.app_service.model.entity.OrderEntity;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo
    extends JpaRepository<OrderEntity, String>, JpaSpecificationExecutor<OrderEntity> {

  @Query(
      value =
          """
            SELECT
              COALESCE(SUM(CASE WHEN o.status = 5 THEN o.total_price ELSE 0 END), 0) AS totalRevenue,
              COUNT(*) AS orderCount,
              COUNT(CASE WHEN o.status = 5 THEN 1 END) AS finishedCount,
              COUNT(CASE WHEN o.status = 0 THEN 1 END) AS canceledCount,
              COUNT(CASE WHEN o.status = -1 THEN 1 END) AS rejectedCount
            FROM orders o
            WHERE o.created_at BETWEEN :from AND :to
            """,
      nativeQuery = true)
  RevenueSummaryDTO getRevenueSummary(@Param("from") Instant from, @Param("to") Instant to);

  @Query(
      value =
          """
                SELECT
                  DATE_FORMAT(o.created_at, :pattern) as dateGroup,
                  SUM(o.total_price)
                FROM orders o
                WHERE o.status = 5 AND o.created_at BETWEEN :from AND :to
                GROUP BY dateGroup
                ORDER BY dateGroup ASC
            """,
      nativeQuery = true)
  List<RevenueChartDTO> getRevenueChart(
      @Param("from") Instant from, @Param("to") Instant to, @Param("pattern") String pattern);

  @Query(
      value =
          """
                SELECT b.title, SUM(oi.quantity)
                FROM order_items oi
                JOIN books b ON oi.book_sku = b.sku
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status = 5 AND o.created_at BETWEEN :from AND :to
                GROUP BY b.title
                ORDER BY SUM(oi.quantity) DESC
            """,
      nativeQuery = true)
  List<Object[]> getTopSellingProducts(
      @Param("from") Instant from, @Param("to") Instant to, Pageable pageable);
}
