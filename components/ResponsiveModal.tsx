import React, { ReactNode } from "react";

const ResponsiveModal = ({
  children,
  modalId,
}: {
  children: ReactNode;
  modalId: string;
}) => {
  return (
    <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-[#111]">{children}</div>
    </dialog>
  );
};

export default ResponsiveModal;
