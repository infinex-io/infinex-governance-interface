import { useFormik } from 'formik';
import { useMemo } from 'react';
import * as yup from 'yup';

import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';

export const useForm = (userProfile: GetUserDetails | undefined) => {
	const validationSchema = yup.object({
		username: yup.string().required(),
		delegationPitches: yup.string(),
		about: yup.string().required(),
		twitter: yup.string(),
		discord: yup.string(),
		github: yup.string(),
		pfpThumbnailUrl: yup.string(),
		website: yup.string(),
	});

	const formik = useFormik({
		initialValues: {
			delegationPitches: userProfile?.delegationPitches || '',
			about: userProfile?.about || '',
			twitter: userProfile?.twitter || '',
			discord: userProfile?.discord || '',
			github: userProfile?.github || '',
			username: userProfile?.username || '',
			pfpThumbnailUrl: userProfile?.pfpThumbnailUrl || '',
			website: userProfile?.website || '',
		},
		validationSchema,
		onSubmit: async (form: any) => {
			console.log(form);
		},
	});

	const errors = useMemo(
		() => ({
			delegationPitches: {
				error: formik.touched.delegationPitches && formik.errors.delegationPitches,
			},
			about: {
				error: formik.touched.about && formik.errors.about,
			},
			twitter: {
				error: formik.touched.twitter && formik.errors.twitter,
			},
			discord: {
				error: formik.touched.discord && formik.errors.discord,
			},
			github: {
				error: formik.touched.github && formik.errors.github,
			},
			username: {
				error: formik.touched.username && formik.errors.username,
			},
			pfpThumbnailUrl: {
				error: formik.touched.pfpThumbnailUrl && formik.errors.pfpThumbnailUrl,
			},
			website: {
				error: formik.touched.website && formik.errors.website,
			},
		}),

		[formik.touched, formik.errors]
	);

	return { formik, errors };
};
