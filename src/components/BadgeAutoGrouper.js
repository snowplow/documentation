import { useEffect } from 'react';

export default function BadgeAutoGrouper() {
  useEffect(() => {
    // Function to group consecutive badge containers
    const groupBadges = () => {
      const badgeContainers = document.querySelectorAll('.snowplow-badge-container');
      const processedContainers = new Set();

      badgeContainers.forEach((container) => {
        if (processedContainers.has(container)) return;

        // Find consecutive badge containers
        const group = [container];
        let nextElement = container.parentElement?.nextElementSibling;

        // Look for consecutive paragraphs containing badges
        while (nextElement && nextElement.querySelector('.snowplow-badge-container')) {
          const nextBadge = nextElement.querySelector('.snowplow-badge-container');
          if (nextBadge) {
            group.push(nextBadge);
            processedContainers.add(nextBadge);
            nextElement = nextElement.nextElementSibling;
          } else {
            break;
          }
        }

        // If we have multiple badges or a single badge that needs grouping
        if (group.length > 0) {
          // Create a wrapper div with flex classes
          const wrapper = document.createElement('div');
          wrapper.className = 'flex flex-wrap items-center gap-1 mb-4';

          // Insert wrapper before first badge's parent
          const firstParent = group[0].parentElement;
          firstParent.parentElement.insertBefore(wrapper, firstParent);

          // Move all badges to the wrapper
          group.forEach((badge) => {
            wrapper.appendChild(badge);
            // Remove empty parent paragraphs
            if (badge.parentElement !== wrapper && badge.parentElement.children.length === 0) {
              badge.parentElement.remove();
            }
          });

          processedContainers.add(container);
        }
      });
    };

    // Run after component mount and when DOM changes
    groupBadges();

    // Also run on window resize to handle responsive changes
    const handleResize = () => groupBadges();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null; // This component doesn't render anything
}