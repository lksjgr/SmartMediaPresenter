import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Transform } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IMoveButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const MoveButton: React.FC<IMoveButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Transform
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('move')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default MoveButton;
