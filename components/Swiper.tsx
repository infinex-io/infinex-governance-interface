import { Icon, IconButton } from '@synthetixio/ui';
import clsx from 'clsx';
import React, { ReactElement, useState } from 'react';
import { Navigation, Pagination, Swiper as SwiperType } from 'swiper';
import {
	Swiper as SwiperReact,
	SwiperProps as SwiperReactProps,
	SwiperSlide,
	SwiperSlideProps,
} from 'swiper/react';

interface SwiperProps extends SwiperReactProps {
	className?: string;
	spaceBetween?: number;
	slidesPerView?: number;
	slides: ReactElement[];
	slideProps?: SwiperSlideProps;
	buttonClassName?: string;
}

export const Swiper: React.FC<SwiperProps> = ({
	className,
	slides,
	spaceBetween = 50,
	slidesPerView,
	slideProps,
	buttonClassName,
	...props
}) => {
	const [swiper, setSwiper] = useState<SwiperType | null>(null);
	return (
		<div>
			<SwiperReact
				className={clsx(className, 'relative')}
				modules={[Navigation, Pagination]}
				navigation={{
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}}
				pagination={{ clickable: true }}
				slidesPerView={slidesPerView}
				spaceBetween={spaceBetween}
				centerInsufficientSlides
				onSwiper={setSwiper}
				{...props}
			>
				{slides.map((slide, i) => (
					<SwiperSlide key={i} {...slideProps}>
						{slide}
					</SwiperSlide>
				))}
			</SwiperReact>

			<SlideButton onClick={() => swiper?.slidePrev()} buttonClassName={buttonClassName} />
			<SlideButton onClick={() => swiper?.slideNext()} buttonClassName={buttonClassName} next />
		</div>
	);
};

interface SlideButtonProps {
	next?: boolean;
	buttonClassName?: string;
	onClick?: () => void;
}

const SlideButton: React.FC<SlideButtonProps> = ({
	next = false,
	buttonClassName = '',
	onClick,
}) => {
	return (
		<IconButton
			rounded
			className={clsx(buttonClassName, 'absolute top-1/2 z-10 -translate-y-1/2', {
				'right-0 swiper-button-next': next,
				'left-0 swiper-button-prev': !next,
			})}
			size="md"
			variant="gray"
			onClick={onClick}
		>
			{!next ? (
				<Icon name="Left-4" className="text-primary text-2xl" />
			) : (
				<Icon name="Right-4" className="text-primary text-2xl" />
			)}
		</IconButton>
	);
};
