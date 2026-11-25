import { openLegalLink } from "@/lib/open-legal-link";
import React from "react";
import { Text } from "react-native";
import { Trans } from "react-i18next";

type LegalLinksTextProps = {
  /** Translation key containing <terms></terms> and <privacy></privacy> tags. */
  i18nKey: string;
  className?: string;
};

export function LegalLinksText({ i18nKey, className }: LegalLinksTextProps) {
  return (
    <Text className={className}>
      <Trans
        i18nKey={i18nKey}
        components={{
          terms: (
            <Text
              className="font-semibold text-brand underline"
              accessibilityRole="link"
              onPress={() => void openLegalLink("terms")}
            />
          ),
          privacy: (
            <Text
              className="font-semibold text-brand underline"
              accessibilityRole="link"
              onPress={() => void openLegalLink("privacy")}
            />
          ),
        }}
      />
    </Text>
  );
}
