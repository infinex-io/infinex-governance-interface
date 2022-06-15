import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import useUpdateUserDetailsMutation from 'mutations/boardroom/useUpdateUserDetailsMutation';
import { useAccount } from 'wagmi';
import { useQueryClient } from 'react-query';

export const useForm = (userProfile: GetUserDetails | undefined) => {
	const [isLoading, setIsLoading] = useState(false);
	const { data } = useAccount();
	const updateUserMutation = useUpdateUserDetailsMutation();
	const userDetailsQuery = useUserDetailsQuery(data?.address ?? '');
	const queryClient = useQueryClient();
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

	// TODO #196 https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
	const formik = useFormik({
		initialValues: {
			delegationPitch: userProfile?.delegationPitch || '',
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
				setIsLoading(true);
				updateUserMutation.mutate(
					{
						...userDetailsQuery.data,
						...form,
					},
					{
						onSuccess: () => {
							setIsLoading(false);
							queryClient.refetchQueries({ active: true });
						},
						onError: (error: any) => {
							console.log(error);
							setIsLoading(false);
						},
					}
				);
			}
		},
	});

	const errors = useMemo(
		() => ({
			delegationPitch: {
				error: formik.touched.delegationPitch && formik.errors.delegationPitch,
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
