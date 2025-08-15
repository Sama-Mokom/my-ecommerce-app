<template>
  <div class="team-members-container">
    <div class="container">
      <div class="team-grid">
        <MemberCard 
        v-for="member in members"
        :key="member.name"
        :image="member.image"
        :name="member.name"
        :title="member.title"
        :twitterLink="member.twitterLink"
        :instaLink="member.instaLink"
        :linkedLink="member.linkedLink"
        />
      </div>
      <div class="carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import MemberCard from './MemberCard.vue';

const members = [
  {image: "src/assets/images/TomCruise.png", name:"Tom Cruise", title:"Founder & Chairman", twitterLink:"#", instaLink:"#", linkedLink:"#"},
  {image: "src/assets/images/EmmaWatson.png", name:"Emma Watson", title:"Managing Director", twitterLink:"#", instaLink:"#", linkedLink:"#"},
  {image: "src/assets/images/WillSmith.png", name:"Will Smith", title:"Product Designer", twitterLink:"#", instaLink:"#", linkedLink:"#"}
]
</script>

<style scoped>
.team-members-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 80px 0;
  background-color: #fff;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
}



.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #db4444;
}

@media (max-width: 992px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .team-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .member-name {
    font-size: 28px;
  }
}
</style>