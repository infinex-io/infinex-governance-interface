import { TextField, Button } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

import { useForm } from './ProfileForm.hook';

type ProfileFormProps = {
	userProfile?: GetUserDetails;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile }) => {
	const { formik, isLoading, errors } = useForm(userProfile);
	const { t } = useTranslation();

	return (
		<form className="flex flex-col gap-1 text-left" onSubmit={formik.handleSubmit}>
			<h4 className="tg-title-h4 my-2 text-center">{t('modals.editProfile.headline')}</h4>
			<h4 className="tg-body mb-4 text-center">{t('modals.editProfile.subheadline')}</h4>

			<div className="flex items-center gap-2">
				<TextField
					{...formik.getFieldProps('username')}
					{...errors.username}
					label={t('modals.editProfile.inputs.headline.username')}
					placeholder={t('modals.editProfile.inputs.placeholder.username')}
				/>

				<TextField
					{...formik.getFieldProps('website')}
					{...errors.website}
					label={t('modals.editProfile.inputs.headline.website')}
					placeholder={t('modals.editProfile.inputs.placeholder.website')}
				/>
			</div>
			<TextField
				{...formik.getFieldProps('about')}
				{...errors.about}
				multiline
				label={t('modals.editProfile.inputs.headline.about')}
				placeholder={t('modals.editProfile.inputs.placeholder.about')}
			/>
			<TextField
				{...formik.getFieldProps('delegationPitch')}
				{...errors.delegationPitch}
				multiline
				label={t('modals.editProfile.inputs.headline.delegationPitch')}
				placeholder={t('modals.editProfile.inputs.placeholder.delegationPitch')}
			/>
			<div className="flex items-center gap-2">
				<TextField
					{...formik.getFieldProps('twitter')}
					{...errors.twitter}
					label={t('modals.editProfile.inputs.headline.twitter')}
					placeholder={t('modals.editProfile.inputs.placeholder.twitter')}
				/>
				<TextField
					{...formik.getFieldProps('discord')}
					{...errors.discord}
					label={t('modals.editProfile.inputs.headline.discord')}
					placeholder={t('modals.editProfile.inputs.placeholder.discord')}
				/>
				<TextField
					{...formik.getFieldProps('github')}
					{...errors.github}
					label={t('modals.editProfile.inputs.headline.github')}
					placeholder={t('modals.editProfile.inputs.placeholder.github')}
				/>
			</div>

			<TextField
				{...formik.getFieldProps('pfpThumbnailUrl')}
				{...errors.pfpThumbnailUrl}
				label={t('modals.editProfile.inputs.headline.profileImageUrl')}
				placeholder={t('modals.editProfile.inputs.placeholder.profileImageUrl')}
			/>

			<div className="mx-auto">
				<Button loading={isLoading} size="lg">
					{t('modals.editProfile.cta')}
				</Button>
			</div>
		</form>
	);
};
