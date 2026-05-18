// components/Dashboard/StatCard.jsx
import * as S from '../../styles/Dashboard.styles';

const StatCard = ({ label, value, icon, color, trend, type }) => {
   // trend styling - green for positive, orange for live, gray for neutral
   const getTrendStyle = () => {
      if (trend === 'Live') return { color: '#ea580c', background: '#fff7ed' };
      if (trend?.startsWith('+')) return { color: '#16a34a', background: '#f0fdf4' };
      return { color: '#6e6e73', background: '#f5f5f7' };
   };

   return (
      <S.StatCardWrapper $color={color}>
         <S.StatCardHeader>
         <S.StatIcon $color={color}>{icon}</S.StatIcon>
         {trend && (
            <S.StatTrend style={getTrendStyle()}>
               {trend}
            </S.StatTrend>
         )}
         </S.StatCardHeader>
         <S.StatValue>{value.toLocaleString()}</S.StatValue>
         <S.StatLabel>{label}</S.StatLabel>
      </S.StatCardWrapper>
   );
};

export default StatCard;