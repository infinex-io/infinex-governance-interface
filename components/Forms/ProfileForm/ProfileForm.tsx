import { TextField } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { Button } from 'components/button';
import { useForm } from './ProfileForm.hook';
import { useEffect, useState } from 'react';

type ProfileFormProps = {
	userProfile?: GetUserDetails;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, setIsOpen }) => {
	const { formik, isLoading, errors, isSuccess} = useForm(userProfile);
	const { t } = useTranslation();

	useEffect(() => {
		if (isSuccess) setIsOpen(false)
	}, [isSuccess])

	return (
		<form className="flex flex-col gap-1 text-left text-slate-50" onSubmit={formik.handleSubmit}>
			<h4 className="tg-title-h4 my-2 text-center">{t('modals.editProfile.headline')}</h4>
			<h4 className="tg-body mb-4 text-center">{t('modals.editProfile.subheadline')}</h4>

			<div className="flex flex-col md:flex-row items-center gap-2">
				<TextField
					{...formik.getFieldProps('username')}
					{...errors.username}
					label={t('modals.editProfile.inputs.headline.username')}
					placeholder={`${t('modals.editProfile.inputs.placeholder.username')}`}
					className="!bg-transparent"
				/>

				<TextField
					{...formik.getFieldProps('website')}
					{...errors.website}
					label={t('modals.editProfile.inputs.headline.website')}
					placeholder={`${t('modals.editProfile.inputs.placeholder.website')}`}
					className="!bg-transparent"
				/>
			</div>
			<TextField
				{...formik.getFieldProps('about')}
				{...errors.about}
				multiline
				label={t('modals.editProfile.inputs.headline.about')}
				placeholder={`${t('modals.editProfile.inputs.placeholder.about')}`}
				className="!bg-transparent"
			/>
			<TextField
				{...formik.getFieldProps('delegationPitch')}
				{...errors.delegationPitch}
				multiline
				label={t('modals.editProfile.inputs.headline.delegationPitch')}
				placeholder={`${t('modals.editProfile.inputs.placeholder.delegationPitch')}`}
				className="!bg-transparent"
			/>
			<div className="flex items-center flex-col md:flex-row gap-2">
				<TextField
					{...formik.getFieldProps('twitter')}
					{...errors.twitter}
					label={t('modals.editProfile.inputs.headline.twitter')}
					placeholder={`${t('modals.editProfile.inputs.placeholder.twitter')}`}
					className="!bg-transparent"
				/>
				<TextField
					{...formik.getFieldProps('discord')}
					{...errors.discord}
					label={t('modals.editProfile.inputs.headline.discord')}
					placeholder={`${t('modals.editProfile.inputs.placeholder.discord')}`}
					className="!bg-transparent"
				/>
				<TextField
					{...formik.getFieldProps('github')}
					{...errors.github}
					label={t('modals.editProfile.inputs.headline.github')}
					placeholder={`${t('modals.editProfile.inputs.placeholder.github')}`}
					className="!bg-transparent"
				/>
			</div>

			<div className="mx-auto">
				<Button loading={isLoading}
					label={t('modals.editProfile.cta') as string}
				/>
			</div>
		</form>
	);
};
