theme_set(theme_gray())
project.path <- '/home/joemarlo/Dropbox/Data/Projects/blog/static/img/posts/NBA/'

ggsave(filename = "LRC_winners.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)

ggpairs(nba_feat_plot_pos,
        columns = 1:(length(names(nba_feat_plot_pos)) - 1),
        progress = FALSE, 
        mapping = ggplot2::aes(colour = nba$Pos, alpha = 0.4),
        upper = list(continuous = wrap('cor', size = 0))
) +
  theme_minimal() +
  labs(title = "Marginal densities and scatterplots between selected features",
       subtitle = "Color represents player positions") +
  theme(plot.margin = unit(c(1, 1, 1, 1), "cm"),
          plot.background = element_rect(fill = NA,
                                         color = "gray95",
                                         size = 10))

ggsave(filename = "pairs.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)



# plot PER vs. salary
ggplot(data = nba, aes(x = Salary, y = PER)) + 
  geom_point(aes_string(color = cl_label)) + 
  geom_label_repel(aes(label = labels_pca),
                   box.padding   = 0.35, 
                   point.padding = 0.5,
                   segment.color = 'grey50') + 
  ggtitle('PER vs. Salary') + 
  scale_x_continuous(labels = scales::dollar) +
  labs(colour = "Cluster") +
  light.theme

ggsave(filename = "PERsalary.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)


# salary diff
salary.diff.df %>% 
  ggplot(aes(y = reorder(Player, Salary_diff), x = Salary_diff,
             color = Salary_diff, labels = Label)) +
  geom_label_repel(aes(label = Label)) +
  geom_point() +
  geom_vline(xintercept = 0,
             linetype = "dashed",
             color = "grey70") +
  scale_y_discrete(breaks = NULL) +
  scale_x_continuous(labels = scales::dollar) +
  scale_color_gradient2(mid = "grey80", high = "green4") +
  coord_cartesian(ylim = c(-15, 500)) +
  labs(title = "Finding over/underpaid players based on cluster membership",
       subtitle = "Difference between player salary and respective cluster mean salary",
       y = "",
       x = "Difference between salary and cluster mean (in millions)\n Negative indicates overpaid") +
  theme(legend.position = "none",
        panel.grid.major = element_blank(),
        panel.grid.minor = element_blank()) +
  light.theme

ggsave(filename = "DIFFsalary.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)


# team plot
ggplot(nba_team, 
       aes(x = team_salary, y = win_pct, color = avg_clust)) + 
  geom_smooth(method = 'lm', formula = y ~ x, se = FALSE, color = 'gray') +
  geom_point() + 
  scale_x_continuous(labels = scales::dollar_format()) +
  geom_label_repel(label = nba_team$Tm) + 
  scale_color_gradient2(low = 'red', 
                        midpoint = mean(nba_team$avg_clust),
                        mid = 'gray',
                        high = 'green4') + 
  labs(title = 'Win % vs. Team Salary',
       x = "Team salary",
       y = "Win percentage",
       colour = "Average cluster") +
  light.theme

ggsave(filename = "WinVSalary.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)


# kmeans
plot_pca(
  km_five,
  data = nba,
  frame = TRUE,
  colour = 'km_labs_opt_names',
  title = 'Kmeans: four cluster solution in principal component space',
  label = km_labels
)

ggsave(filename = "Kmeans4.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)

# hclust
plot_pca(
  nba_pca,
  frame = TRUE,
  data = nba,
  colour = hcl_labs[2],
  title = paste0('Hclust: four cluster solution in principal component space'),
  label = hcl_labels
)

ggsave(filename = "HCL4.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)

# mclust
fviz_mclust(player_clust.mcl,
            "classification",
            geom = "point",
            main = "Model-based clustering in principal component space",
            xlab = "PC1",
            ylab = "PC2") + light.theme

ggsave(filename = "MC5.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)

# plot averages by cluster
nba_km_avg %>% 
  select(km_labs_opt_names, VORP, PER, RPM) %>% 
  pivot_longer(cols = c("VORP", "PER", "RPM")) %>%
  ggplot(aes(x = km_labs_opt_names, y = value)) +
  geom_col(fill = rep(c("indianred1", "palegreen2", "darkslategray2", "plum2"), 3),
           alpha = 0.9) +
  facet_wrap(~name, scales = 'free') + 
  labs(title = 'Overall player performance by cluster',
       subtitle = 'Average advanced statistics',
       x = 'Cluster', 
       y = '') +
  light.theme

ggsave(filename = "ClusterPer.svg",
       plot = last_plot(),
       path = project.path,
       device = "svg",
       width = 9,
       height = 5)
