import { useEffect, useRef } from "react";

const ContentPage = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetDiv = document.querySelector(
      ".flex.flex-col.gap-2.text-token-text-primary.text-sm.false.mt-5.pb-2"
    );

    if (targetDiv && sideBarRef?.current) {
      targetDiv.prepend(sideBarRef?.current);
    }
  }, []);

  return (
    <div ref={sideBarRef} className="p-2">
      <h3 className="text-xs font-semibold text-ellipsis" >Today</h3>
      <ol>
        <li className="py-2" >Insert</li>
      </ol>
    </div>
  );
};

export default ContentPage;
