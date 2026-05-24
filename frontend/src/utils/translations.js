export const translateRank = (rank) => {

  const ranks = {

    Bronze: "Бронза",
    Silver: "Серебро",
    Gold: "Золото",
    Platinum: "Платина",
    Diamond: "Алмаз",
    Master: "Мастер",
    Grandmaster: "Грандмастер"

  }

  return ranks[rank] || rank
}

export const translateAchievement = (title) => {

  const achievements = {

    "First Victory": "Первая победа",
    "Tournament Champion": "Чемпион турнира"

  }

  return achievements[title] || title
}

export const translateAchievementDescription = (
  description
) => {

  const descriptions = {

    "Win first match":
      "Выиграть первый матч",

    "Win tournament":
      "Выиграть турнир"

  }

  return descriptions[description] || description
}

export const translateStatus = (status) => {

  const statuses = {

    pending: "Ожидание",
    active: "Активный",
    finished: "Завершён"

  }

  return statuses[status] || status
}