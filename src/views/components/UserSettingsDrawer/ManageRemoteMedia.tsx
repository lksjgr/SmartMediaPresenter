import React from 'react';
import SettingsRow from '../SettingsRow';
import { Box } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { Folder } from '@mui/icons-material';

const ManageRemoteMedia: React.FC<{}> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<SettingsRow
			label={t('manageRemoteMedia')}
			node={
				<Box
					sx={{
						width: '65px',
						height: '65px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '50%',
						backgroundColor: 'background.default',
					}}
				>
					<Folder sx={{ fontSize: '30px', color: 'text.primary' }} />
				</Box>
			}
			onClick={() => {
				// TODO: open modal to handle remote media
			}}
		/>
	);
};

export default ManageRemoteMedia;
