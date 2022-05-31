import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useUpdateUserDetailsMutation from 'mutations/boardroom/useUpdateUserDetailsMutation';
import { useAccount } from 'wagmi';

export const useForm = (userProfile: GetUserDetails | undefined) => {
	const [isLoading, setIsLoading] = useState(false);
	const { data } = useAccount();
	const updateUserMutation = useUpdateUserDetailsMutation();
	const userDetailsQuery = useUserDetailsQuery(data?.address ?? '');

	const validationSchema = yup.object({
		username: yup.string().required(),
		pitch: yup.string(),
		about: yup.string().required(),
		twitter: yup.string(),
		discord: yup.string(),
		github: yup.string(),
		pfpThumbnailUrl: yup.string(),
		website: yup.string(),
	});

	const formik = useFormik({
		initialValues: {
			pitch: `${JSON.parse(userProfile?.delegationPitches || '').synthetix || ''}`,
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
			if (userDetailsQuery.data && !isLoading) {
				const delegationPitches = {
					synthetix: form.pitch,
				};

				delete form.pitch;
				setIsLoading(true);
				updateUserMutation.mutate(
					{
						...userDetailsQuery.data,
						...form,
						delegationPitches: JSON.stringify(delegationPitches),
					},
					{
						onSuccess: () => {
							setIsLoading(false);
						},
						onError: (error: any) => {
							console.log(error);
							setIsLoading(false);
						},
					}
				);
			}

			console.log(form);
		},
	});

	const errors = useMemo(
		() => ({
			pitch: {
				error: formik.touched.pitch && formik.errors.pitch,
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

	return { formik, isLoading, errors };
};
