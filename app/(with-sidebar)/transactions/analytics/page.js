'use client';

import React, { useState, useEffect, cloneElement } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale } from 'chart.js';
import BaseButton from '@/components/button/base-button';
import { nextClient } from '@/lib/nextClient';
import ModalContainer from '@/components/modal/modal-container';
import classes from "./page.module.css";

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale);

export default function SalesExpenses() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [list, setList] = useState({ 매출: [], 지출: [] });
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [salesData, setSalesData] = useState({});
  const [expensesData, setExpensesData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null); // 선택된 사업자 유형 상태

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const loadTransactionAnalyticsPageData = async () => {
      try {
        const response = await nextClient.get('/finance/analytics/transactionchart', {
          params: {
            storeid: 3,
            year: selectedYear,
            month: selectedMonth,
          },
        });

        const data = response.data;

        console.log('응답 데이터: ', data);

        // 'data.sales'와 'data.expenses'가 undefined일 경우 빈 배열로 처리
        const filteredSales = (data.data.sales || []).filter(
          (item) => new Date(item.transactionDate).getFullYear() === selectedYear &&
                    new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );
        const filteredExpenses = (data.data.expenses || []).filter(
          (item) => new Date(item.transactionDate).getFullYear() === selectedYear &&
                    new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );

        const calculateCategoryTotals = (items) => {
          const categories = [...new Set(items.map(item => item.classficationCode))];
          return categories.map(category => ({
            category,
            total: items
              .filter(item => item.classficationCode === category)
              .reduce((sum, item) => sum + parseInt(item.amount), 0)
          }));
        };

        const salesCategoryTotals = calculateCategoryTotals(filteredSales);
        const expensesCategoryTotals = calculateCategoryTotals(filteredExpenses);
        const monthlySales = data.data.monthlySales;

        setList({ 매출: filteredSales, 지출: filteredExpenses });
        setTotalSales(data.data.totalSales || 0);
        setTotalExpenses(data.data.totalExpenses || 0);
        setMonthlySalesData(data.data.monthlySales);
        console.log(data.data.monthlySales);

        setSalesData({
          labels: salesCategoryTotals.map(item => item.category),
          datasets: [
            {
              label: '매출 카테고리별',
              data: salesCategoryTotals.map(item => item.total),
              hoverOffset: 6,
            },
          ],
        });

        setExpensesData({
          labels: expensesCategoryTotals.map(item => item.category),
          datasets: [
            {
              label: '지출 카테고리별',
              data: expensesCategoryTotals.map(item => item.total),
              hoverOffset: 6,
            },
          ],
        });
      } catch (error) {
        console.error('API 호출 실패: ', error);
      }
    };

    loadTransactionAnalyticsPageData();
  }, [selectedYear, selectedMonth]);

  // 간편장부
  const handleBusinessTypeSelection = async (type) => {
    setSelectedBusinessType(type);
    console.log(`${type} 선택 완료`);
  
    try {
      await nextClient.post(
        `/finance/analytics/transactionsimplepdf?storeid=3&year=${selectedYear}&month=${selectedMonth}&taxtype=${selectedBusinessType}`,
        { type }, // 요청 본문(body)
      );
      console.log('POST 요청 성공');
      handleCloseModal();
    } catch (error) {
      console.error('POST 요청 실패:', error);
    }
  };

  // 손익계산서
  const handleGenerateIncomeStatement = async () => {
    try {
      const response = await nextClient.post(
        `/finance/analytics/transactionpdf?storeid=3&year=${selectedYear}&month=${selectedMonth}`
      );
      console.log('손익계산서 요청 성공:', response.data);
    } catch (error) {
      console.error('손익계산서 요청 실패:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectContainer}>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {[2024, 2023, 2022, 2021, 2020].map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}월
            </option>
          ))}
        </select>
      </div>

      <div className={classes.gridContainer}>
        <div className={classes.leftSection}>
          <div className={classes.summaryContainer}>
            <div className={classes.card}>
              <div className={classes.icon}>📈</div>
              <div className={classes.textContainer}>
                <h3>매출</h3>
                <p>{totalSales ? totalSales.toLocaleString() : 0}원</p> 
              </div>
            </div>
            <div className={classes.card}>
              <div className={classes.icon}>📉</div>
              <div className={classes.textContainer}>
                <h3>지출</h3>
                <p>{totalExpenses ? totalExpenses.toLocaleString() : 0}원</p>
              </div>
            </div>
          </div>

          <div className={classes.chartContainer}>
            <div>
              <h2>매출</h2>
              {salesData.labels ? (
                <Doughnut data={salesData} options={options} />
              ) : (
                <p>매출 데이터 로딩 중...</p>
              )}
            </div>
            <div>
              <h2>지출</h2>
              {expensesData.labels ? (
                <Doughnut data={expensesData} options={options} />
              ) : (
                <p>지출 데이터 로딩 중...</p>
              )}
            </div>
          </div>

          <div className={classes.reportsContainer}>
            <BaseButton text="손익계산서 발급" onClick={handleGenerateIncomeStatement}/>
            <BaseButton text="간편장부 발급" onClick={handleOpenModal}/>
          </div>
        </div>

                <ModalContainer
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="사업자 유형 선택"
          onConfirm={() => handleBusinessTypeSelection(selectedBusinessType)}
        >
          <div className={classes.modalInfoText}>
            <p>연 매출이 1억 400만원 이상인 경우 일반사업자를 선택해 주세요.</p>
            <p>연 매출이 1억 400만원 미만인 경우 간이사업자를 선택해 주세요.</p>
          </div>
          
          <div className={classes.modalRadioGroup}>
            <label>
              <input
                type="radio"
                name="businessType"
                value="0"
                checked={selectedBusinessType === '0'}
                onChange={() => setSelectedBusinessType('0')}
              />
              간이사업자
            </label>
            <label>
              <input
                type="radio"
                name="businessType"
                value="1"
                checked={selectedBusinessType === '1'}
                onChange={() => setSelectedBusinessType('1')}
              />
              일반사업자
            </label>
          </div>
        </ModalContainer>


        <div className={classes.rightSection}>
          <h2>월별 매출</h2>
          {monthlySalesData?.datasets ? ( // 데이터셋 확인
            <Bar data={monthlySalesData} options={options} />
          ) : (
            <p>월별 매출 데이터 로딩 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}
