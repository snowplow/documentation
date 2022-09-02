import React from 'react';
import clsx from 'clsx';
import {
    useCurrentSidebarCategory,
    filterDocCardListItems,
} from '@docusaurus/theme-common';
import SnowplowDocCard from '@site/src/components/SnowplowDocCard';
import type { Props } from '@theme/DocCardList';

function SnowplowDocCardListForCurrentSidebarCategory({ className }: Props) {
    const category = useCurrentSidebarCategory();
    return <SnowplowDocCardList items={category.items} className={className} />;
}

export default function SnowplowDocCardList(props: Props): JSX.Element {
    const { items, className } = props;
    if (!items) {
        return <SnowplowDocCardListForCurrentSidebarCategory {...props} />;
    }
    const filteredItems = filterDocCardListItems(items);
    return (
        <section className={clsx('row', className)}>
            {filteredItems.map((item, index) => (
                <article key={index} className="col col--6 margin-bottom--lg">
                    <SnowplowDocCard item={item} />
                </article>
            ))}
        </section>
    );
}