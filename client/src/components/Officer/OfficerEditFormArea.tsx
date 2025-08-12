import React, { useState, useEffect } from 'react';
import { OfficerRecord } from '../../utilities/officerUtils';
import { MemberRecord } from '../../utilities/memberUtils';


interface Props {
  item: OfficerRecord;
  setItem: React.Dispatch<React.SetStateAction<OfficerRecord | null>>;
  isNew: boolean;
  members: MemberRecord[];
}

const OfficerEditFormArea: React.FC<Props> = ({ item, setItem, isNew, members}) => {

  const onChange = (field: keyof OfficerRecord, value: any) => {
    setItem((prev) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="p-4">
      <div>
        <label className="block mb-1 font-semibold">Ref Key</label>
        <input
          type="text"
          value={item.refKey}
          onChange={(e) => onChange('refKey', e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Committee Key</label>
        <input
          type="text"
          value={item.commKey}
          onChange={(e) => onChange('commKey', e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Order</label>
        <input
          type="number"
          value={item.order}
          onChange={(e) => onChange('order', parseInt(e.target.value, 10))}
          className="input input-bordered w-full"
          min={0}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Member</label>
        <select
          value={
            typeof item.holderId === "object" && item.holderId !== null
              ? item.holderId._id
              : item.holderId || ""
          }
          onChange={(e) => onChange('holderId', e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">-- Select Member --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member._id.slice(0, 4)} - {member.firstName} {member.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Position</label>
        <input
          type="text"
          value={item.position}
          onChange={(e) => onChange('position', e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
};

export default OfficerEditFormArea;
