import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
    findFirstCategoryLink,
    useDocById,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';

import type { Props } from '../SnowplowDocCard';
import type {
    PropSidebarItemCategory,
    PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

import styles from '../SnowplowDocCard/styles.modules.css'

function SnowplowCardContainer({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}): JSX.Element {
    return (
        <Link
            href={href}
            className={clsx('card padding--lg', styles.snowplowCardContainer)}>
            {children}
        </Link>
    );
}

function SnowplowCardLayout({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: ReactNode;
    title: string;
    description?: string;
}): JSX.Element {
    return (
        <SnowplowCardContainer href={href}>
            <h2 className={clsx('text--wrap', styles.snowplowCardTitle)} title={title}>
                {icon} {title}
            </h2>
            {description && (
                <p
                    className={clsx('text--wrap', styles.snowplowCardDescription)}
                    title={description}>
                    {description}
                </p>
            )}
        </SnowplowCardContainer>
    );
}

function SnowplowCardCategory({
    item,
}: {
    item: PropSidebarItemCategory;
}): JSX.Element | null {
    const href = findFirstCategoryLink(item);

    // Unexpected: categories that don't have a link have been filtered upfront
    if (!href) {
        return null;
    }

    return (
        <SnowplowCardLayout
            href={href}
            icon="🗃️"
            title={item.label}
            description={translate(
                {
                    message: '{count} items',
                    id: 'theme.docs.SnowplowDocCard.categoryDescription',
                    description:
                        'The default description for a category card in the generated index about how many items this category includes',
                },
                { count: item.items.length },
            )}
        />
    );
}

function SnowplowCardLink({ item }: { item: PropSidebarItemLink }): JSX.Element {
    const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
    const doc = useDocById(item.docId ?? undefined);
    return (
        <SnowplowCardLayout
            href={item.href}
            icon={icon}
            title={item.label}
            description={doc?.description}
        />
    );
}

export default function SnowplowDocCard({ item }: Props): JSX.Element {
    switch (item.type) {
        case 'link':
            return <SnowplowCardLink item={item} />;
        case 'category':
            return <SnowplowCardCategory item={item} />;
        default:
            throw new Error(`unknown item type ${JSON.stringify(item)}`);
    }
}