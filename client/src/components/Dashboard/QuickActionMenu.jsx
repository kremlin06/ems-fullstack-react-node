// components/Dashboard/QuickActionMenu.jsx
import * as S from '../../styles/Dashboard.styles';
import Button from '../Button';

const QuickActionMenu = ({ actions }) => {
  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>Quick Actions</S.CardTitle>
        <S.CardSubtitle>Start a common task</S.CardSubtitle>
      </S.CardHeader>
      <S.ActionGrid>
        {actions.map((action, index) => (
          <S.ActionButton
            key={index}
            onClick={action.onClick}
            $variant={action.variant}
            type="button"
          >
            <S.ActionIcon>{action.icon}</S.ActionIcon>
            <S.ActionContent>
              <S.ActionLabel>{action.label}</S.ActionLabel>
              <S.ActionDesc>{action.description}</S.ActionDesc>
            </S.ActionContent>
          </S.ActionButton>
        ))}
      </S.ActionGrid>
    </S.Card>
  );
};

export default QuickActionMenu;