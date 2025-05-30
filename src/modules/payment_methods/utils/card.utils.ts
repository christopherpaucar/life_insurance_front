export enum CardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  UNKNOWN = 'unknown',
}

export const getCardType = (cardNumber: string): CardType => {
  const firstDigit = cardNumber.charAt(0)
  const firstTwoDigits = cardNumber.slice(0, 2)

  if (firstDigit === '4') return CardType.VISA
  if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return CardType.MASTERCARD
  if (firstTwoDigits === '34' || firstTwoDigits === '37') return CardType.AMEX
  if (firstTwoDigits === '65' || firstTwoDigits === '64') return CardType.DISCOVER

  return CardType.UNKNOWN
}

interface CardStyle {
  gradient: string
  textColor: string
  mutedTextColor: string
}

export const getCardStyle = (cardType: CardType): CardStyle => {
  switch (cardType) {
    case CardType.VISA:
      return {
        gradient: 'from-[#1A1F71] via-[#1A1F71] to-[#0A0F61]',
        textColor: 'text-white',
        mutedTextColor: 'text-blue-200',
      }
    case CardType.MASTERCARD:
      return {
        gradient: 'from-[#FF5F6D] via-[#FF9966] to-[#FF5F6D]',
        textColor: 'text-white',
        mutedTextColor: 'text-orange-100',
      }
    case CardType.AMEX:
      return {
        gradient: 'from-[#006FCF] via-[#006FCF] to-[#0057A3]',
        textColor: 'text-white',
        mutedTextColor: 'text-blue-100',
      }
    case CardType.DISCOVER:
      return {
        gradient: 'from-[#FF6000] via-[#FF6000] to-[#CC4D00]',
        textColor: 'text-white',
        mutedTextColor: 'text-orange-100',
      }
    default:
      return {
        gradient: 'from-primary/20 to-primary/5',
        textColor: 'text-foreground',
        mutedTextColor: 'text-muted-foreground',
      }
  }
}
