"use client";

import React from "react";
import { Switch } from "../ui/Switch";

interface Privilege {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  all: boolean;
}

interface PrivilegeTogglesProps {
  privileges: Privilege;
  onChange: (newPrivileges: Privilege) => void;
  disabled?: boolean;
}

export function PrivilegeToggles({ privileges, onChange, disabled }: PrivilegeTogglesProps) {
  const handleToggle = (key: keyof Privilege, checked: boolean) => {
    const newPrivileges = { ...privileges, [key]: checked };
    
    // If 'all' is clicked, set all to the same value
    if (key === 'all') {
      newPrivileges.create = checked;
      newPrivileges.read = checked;
      newPrivileges.update = checked;
      newPrivileges.delete = checked;
    } else {
      // If any of the others are clicked, update 'all' accordingly
      if (newPrivileges.create && newPrivileges.read && newPrivileges.update && newPrivileges.delete) {
        newPrivileges.all = true;
      } else {
        newPrivileges.all = false;
      }
    }
    
    onChange(newPrivileges);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div>
          <h4 className="font-medium text-foreground">All Functions Access</h4>
          <p className="text-sm text-muted-foreground">Grant full CRUD access for this module.</p>
        </div>
        <Switch 
          checked={privileges?.all || false} 
          onCheckedChange={(c) => handleToggle('all', c)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'create', label: 'Create Access', desc: 'Can add new records' },
          { key: 'read', label: 'Read Access', desc: 'Can view existing records' },
          { key: 'update', label: 'Update Access', desc: 'Can edit existing records' },
          { key: 'delete', label: 'Delete Access', desc: 'Can remove records' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between p-4 rounded-lg border border-border bg-card">
            <div>
              <h4 className="font-medium text-foreground capitalize">{label}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <Switch 
              checked={privileges?.[key as keyof Privilege] || false} 
              onCheckedChange={(c) => handleToggle(key as keyof Privilege, c)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
